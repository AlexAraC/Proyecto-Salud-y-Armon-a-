const { sql } = require('../config/db');


// =====================================
// CONSTANTES
// =====================================

const METODOS_PAGO_VALIDOS = ['Efectivo', 'Tarjeta', 'Sinpe'];

const MAX_PRODUCTOS = 50;

const ESTADOS_VALIDOS = [
    'Pendiente',
    'Listo para recoger',
    'Listo',
    'Enviado',
    'Entregado',
    'Cancelado'
];

const TRANSICIONES_VALIDAS = {
    'Normal': {
        'Pendiente': ['Listo para recoger'],
        'Listo para recoger': ['Entregado', 'Pendiente'],
        'Entregado': ['Pendiente']
    },
    'Express': {
        'Pendiente': ['Enviado', 'Listo', 'Entregado'],
        'Enviado':   ['Listo', 'Entregado', 'Pendiente'],
        'Listo':     ['Entregado', 'Pendiente'],
        'Entregado': ['Pendiente', 'Enviado']
    }
};


// =====================================
// CREAR PEDIDO
// =====================================

const crearPedido = async (req, res, next) => {

    const transaction = new sql.Transaction();

    try {

        const { id: usuarioId } = req.usuario;

        const {
            metodo_pago,
            productos
        } = req.body;


        // =====================================
        // VALIDAR MÉTODO DE PAGO
        // =====================================

        if (!metodo_pago || !METODOS_PAGO_VALIDOS.includes(metodo_pago)) {

            return res.status(400).json({
                mensaje: `Método de pago no válido. Válidos: ${METODOS_PAGO_VALIDOS.join(', ')}`
            });

        }


        // =====================================
        // VALIDAR PRODUCTOS
        // =====================================

        if (!productos || !Array.isArray(productos) || productos.length === 0) {

            return res.status(400).json({
                mensaje: 'Debe incluir al menos un producto'
            });

        }

        if (productos.length > MAX_PRODUCTOS) {

            return res.status(400).json({
                mensaje: `Máximo ${MAX_PRODUCTOS} productos por pedido`
            });

        }


        // =====================================
        // INICIAR TRANSACCIÓN
        // =====================================

        await transaction.begin();


        // =====================================
        // PROCESAR PRODUCTOS (UPDATE ATÓMICO)
        // =====================================

        let total = 0;

        const productosProcesados = [];

        const idsVistos = new Set();

        for (const producto of productos) {

            // =====================================
            // VALIDAR producto_id
            // =====================================

            if (!Number.isInteger(producto.producto_id) || producto.producto_id <= 0) {

                await transaction.rollback();

                return res.status(400).json({
                    mensaje: 'producto_id debe ser un número entero positivo'
                });

            }


            // =====================================
            // VALIDAR CANTIDAD
            // =====================================

            if (!Number.isInteger(producto.cantidad) || producto.cantidad <= 0) {

                await transaction.rollback();

                return res.status(400).json({
                    mensaje: 'La cantidad debe ser un número entero positivo'
                });

            }


            // =====================================
            // DETECTAR PRODUCTO REPETIDO
            // =====================================

            if (idsVistos.has(producto.producto_id)) {

                await transaction.rollback();

                return res.status(400).json({
                    mensaje: `El producto ID ${producto.producto_id} está repetido en la solicitud`
                });

            }

            idsVistos.add(producto.producto_id);


            // =====================================
            // OBTENER DATOS DEL PRODUCTO (SOLO LECTURA)
            // =====================================

            const productoDB = await transaction.request().query`

                SELECT
                    p.id,
                    p.nombre,
                    p.precio

                FROM Productos p

                WHERE p.id = ${producto.producto_id}
                  AND p.activo = 1
            `;

            if (productoDB.recordset.length === 0) {

                await transaction.rollback();

                return res.status(404).json({
                    mensaje: `Producto ID ${producto.producto_id} no encontrado`
                });

            }

            const productoReal = productoDB.recordset[0];


            // =====================================
            // DESCONTAR STOCK ATÓMICAMENTE
            // =====================================

            const updateResult = await transaction.request().query`

                UPDATE Inventario

                SET stock = stock - ${producto.cantidad}

                OUTPUT INSERTED.stock

                WHERE producto_id = ${producto.producto_id}
                  AND stock >= ${producto.cantidad}
            `;

            if (updateResult.rowsAffected[0] === 0) {

                await transaction.rollback();

                return res.status(400).json({
                    mensaje: `Stock insuficiente para ${productoReal.nombre}`
                });

            }


            // =====================================
            // CALCULAR SUBTOTAL
            // =====================================

            const subtotal = productoReal.precio * producto.cantidad;

            total += subtotal;


            // =====================================
            // GUARDAR PRODUCTO PROCESADO
            // =====================================

            productosProcesados.push({

                producto_id: productoReal.id,

                nombre_producto: productoReal.nombre,

                cantidad: producto.cantidad,

                subtotal

            });

        }


        // =====================================
        // CREAR PEDIDO
        // =====================================

        const pedido = await transaction.request().query`

            INSERT INTO Pedidos
            (
                usuario_id,
                estado,
                total,
                metodo_pago
            )

            OUTPUT INSERTED.id

            VALUES
            (
                ${usuarioId},
                'Pendiente',
                ${total},
                ${metodo_pago}
            )
        `;

        const pedidoId = pedido.recordset[0].id;


        // =====================================
        // CREAR DETALLES
        // =====================================

        for (const prod of productosProcesados) {

            await transaction.request().query`

                INSERT INTO DetallePedido
                (
                    pedido_id,
                    producto_id,
                    nombre_producto,
                    cantidad,
                    subtotal
                )

                VALUES
                (
                    ${pedidoId},
                    ${prod.producto_id},
                    ${prod.nombre_producto},
                    ${prod.cantidad},
                    ${prod.subtotal}
                )
            `;

        }


        // =====================================
        // CONFIRMAR TRANSACCIÓN
        // =====================================

        await transaction.commit();


        // =====================================
        // RESPUESTA
        // =====================================

        res.json({
            mensaje: 'Pedido creado correctamente',
            pedidoId,
            total
        });


    } catch (error) {

        try {
            await transaction.rollback();
        } catch (rollbackError) {
            // Ignorar si ya fue revertida
        }

        next(error);

    }

};


// =====================================
// CANCELAR PEDIDO
// =====================================

const cancelarPedido = async (req, res, next) => {

    const transaction = new sql.Transaction();

    try {

        const { id } = req.params;

        const { id: usuarioId, rol: usuarioRol } = req.usuario;


        // =====================================
        // INICIAR TRANSACCIÓN
        // =====================================

        await transaction.begin();


        // =====================================
        // BUSCAR PEDIDO
        // =====================================

        const pedidoDB = await transaction.request().query`

            SELECT
                id,
                usuario_id,
                estado

            FROM Pedidos

            WHERE id = ${id}
        `;


        if (pedidoDB.recordset.length === 0) {

            await transaction.rollback();

            return res.status(404).json({
                mensaje: 'Pedido no encontrado'
            });

        }

        const pedido = pedidoDB.recordset[0];


        // =====================================
        // VALIDAR PROPIETARIO (o administrador)
        // =====================================

        if (pedido.usuario_id !== usuarioId && usuarioRol !== 'admin') {

            await transaction.rollback();

            return res.status(403).json({
                mensaje: 'No puedes cancelar este pedido'
            });

        }


        // =====================================
        // VALIDAR ESTADO
        // =====================================

        if (pedido.estado === 'Cancelado') {

            await transaction.rollback();

            return res.status(400).json({
                mensaje: 'El pedido ya está cancelado'
            });

        }

        if (pedido.estado === 'Entregado') {

            await transaction.rollback();

            return res.status(400).json({
                mensaje: 'No se puede cancelar un pedido ya entregado'
            });

        }

        if (pedido.estado === 'Listo para recoger') {

            await transaction.rollback();

            return res.status(400).json({
                mensaje: 'No se puede cancelar un pedido listo para recoger. Contacte al administrador.'
            });

        }


        // =====================================
        // OBTENER DETALLES DEL PEDIDO
        // =====================================

        const detallesDB = await transaction.request().query`

            SELECT
                producto_id,
                cantidad

            FROM DetallePedido

            WHERE pedido_id = ${id}
        `;

        const detalles = detallesDB.recordset;


        // =====================================
        // DEVOLVER STOCK
        // =====================================

        for (const detalle of detalles) {

            await transaction.request().query`

                UPDATE Inventario

                SET stock = stock + ${detalle.cantidad}

                WHERE producto_id = ${detalle.producto_id}
            `;

        }


        // =====================================
        // ACTUALIZAR ESTADO
        // =====================================

        await transaction.request().query`

            UPDATE Pedidos

            SET estado = 'Cancelado'

            WHERE id = ${id}
        `;


        // =====================================
        // CONFIRMAR TRANSACCIÓN
        // =====================================

        await transaction.commit();


        // =====================================
        // RESPUESTA
        // =====================================

        res.json({
            mensaje: 'Pedido cancelado correctamente'
        });


    } catch (error) {

        try {
            await transaction.rollback();
        } catch (rollbackError) {
            // Ignorar si ya fue revertida
        }

        next(error);

    }

};


// =====================================
// OBTENER PEDIDO POR ID
// =====================================

const obtenerPedidoPorId = async (req, res, next) => {

    try {

        const { id } = req.params;

        const { id: usuarioId, rol: usuarioRol } = req.usuario;

        const pedidoDB = await sql.query`

            SELECT
                p.id,
                p.usuario_id,
                u.nombre AS usuario,
                p.fecha,
                p.estado,
                p.total,
                p.metodo_pago,
                p.tipo_envio,
                p.direccion_envio,
                u.direccion AS usuario_direccion,
                u.telefono AS usuario_telefono

            FROM Pedidos p
            LEFT JOIN Usuarios u
                ON p.usuario_id = u.id

            WHERE p.id = ${id}
        `;

        if (pedidoDB.recordset.length === 0) {

            return res.status(404).json({
                mensaje: 'Pedido no encontrado'
            });

        }

        const pedido = pedidoDB.recordset[0];

        // =====================================
        // VALIDAR PROPIETARIO (IDOR protection)
        // =====================================

        if (pedido.usuario_id !== usuarioId && usuarioRol !== 'admin') {

            return res.status(403).json({
                mensaje: 'No tienes permiso para ver este pedido'
            });

        }

        const productosDB = await sql.query`

            SELECT
                nombre_producto,
                cantidad,
                subtotal

            FROM DetallePedido

            WHERE pedido_id = ${id}
        `;

        res.json({
            pedido,
            productos: productosDB.recordset
        });

    } catch (error) {

        next(error);

    }

};


// =====================================
// ACTUALIZAR ESTADO PEDIDO
// =====================================

const actualizarEstadoPedido = async (req, res, next) => {

    try {

        const { id } = req.params;

        const { estado } = req.body;


        // =====================================
        // VALIDAR ESTADO
        // =====================================

        if (!ESTADOS_VALIDOS.includes(estado)) {

            return res.status(400).json({
                mensaje: 'Estado no válido'
            });

        }


        // =====================================
        // VALIDAR PEDIDO EXISTE
        // =====================================

        const pedidoDB = await sql.query`

            SELECT id, estado AS estado_actual, tipo_envio

            FROM Pedidos

            WHERE id = ${id}
        `;

        if (pedidoDB.recordset.length === 0) {

            return res.status(404).json({
                mensaje: 'Pedido no encontrado'
            });

        }

        const pedido = pedidoDB.recordset[0];


        // =====================================
        // VALIDAR TRANSICIÓN SEGÚN TIPO DE ENVÍO
        // =====================================

        const tipoEnvio = pedido.tipo_envio || 'Normal';

        const permitidas = TRANSICIONES_VALIDAS[tipoEnvio]?.[pedido.estado_actual] || [];

        if (!permitidas.includes(estado) && estado !== 'Cancelado') {

            return res.status(400).json({
                mensaje: `Transición de ${pedido.estado_actual} a ${estado} no permitida para envío ${tipoEnvio}`
            });

        }


        // =====================================
        // ACTUALIZAR ESTADO
        // =====================================

        const resultado = await sql.query`

            UPDATE Pedidos

            SET estado = ${estado}

            WHERE id = ${id}
        `;

        if (resultado.rowsAffected[0] === 0) {

            return res.status(404).json({
                mensaje: 'Pedido no encontrado'
            });

        }


        // =====================================
        // RESPUESTA
        // =====================================

        res.json({
            mensaje: 'Estado actualizado correctamente'
        });


    } catch (error) {

        next(error);

    }

};


// =====================================
// VER PEDIDOS ADMIN
// =====================================

const verPedidosAdmin = async (req, res, next) => {

    try {

        const todosLosPedidos = await sql.query`

            SELECT

                p.id,

                u.nombre AS usuario,

                u.correo AS usuario_correo,

                u.telefono AS usuario_telefono,

                u.direccion AS usuario_direccion,

                p.fecha,

                p.estado,

                p.total,

                p.metodo_pago,

                p.tipo_envio

            FROM Pedidos p

            LEFT JOIN Usuarios u

                ON p.usuario_id = u.id

            ORDER BY

                p.fecha DESC
        `;

        res.json({
            mensaje: 'Pedidos obtenidos correctamente',
            pedidos: todosLosPedidos.recordset
        });

    } catch (error) {

        next(error);

    }

};


// =====================================
// VER PEDIDOS CLIENTE
// =====================================

const verPedidosCliente = async (req, res, next) => {

    try {

        const { id } = req.usuario;

        const pedidosCliente = await sql.query`

            SELECT
                p.id,
                p.fecha,
                p.estado,
                p.total,
                p.metodo_pago,
                p.tipo_envio

            FROM Pedidos p

            WHERE p.usuario_id = ${id}

            ORDER BY p.fecha DESC
        `;

        res.json({
            mensaje: 'Pedidos obtenidos correctamente',
            pedidos: pedidosCliente.recordset
        });

    } catch (error) {

        next(error);

    }

};


// =====================================
// OBTENER ESTADÍSTICAS DE PEDIDOS
// =====================================

const obtenerEstadisticasPedidos = async (req, res, next) => {

    try {

        // =====================================
        // PEDIDOS ÚLTIMOS 6 MESES
        // =====================================

        const pedidosPorMes = await sql.query`

            SELECT

                YEAR(fecha) AS año,

                MONTH(fecha) AS mes,

                COUNT(*) AS cantidad_pedidos

            FROM Pedidos

            WHERE fecha >= DATEADD(MONTH, -6, GETDATE())

            GROUP BY
                YEAR(fecha),
                MONTH(fecha)

            ORDER BY
                año,
                mes
        `;


        // =====================================
        // TOP 5 PRODUCTOS MÁS VENDIDOS
        // =====================================

        const productosMasVendidos = await sql.query`

            SELECT TOP 5

                Productos.id,

                Productos.nombre,

                SUM(DetallePedido.cantidad)
                AS total_vendido

            FROM DetallePedido

            INNER JOIN Productos
            ON DetallePedido.producto_id = Productos.id

            GROUP BY
                Productos.id,
                Productos.nombre

            ORDER BY total_vendido DESC
        `;


        // =====================================
        // RESPUESTA
        // =====================================

        res.json({
            mensaje: 'Estadísticas obtenidas correctamente',
            pedidosPorMes: pedidosPorMes.recordset,
            productosMasVendidos: productosMasVendidos.recordset
        });

    } catch (error) {

        next(error);

    }

};


// =====================================
// OBTENER PEDIDOS POR USUARIO
// =====================================

const obtenerPedidosPorUsuario = async (req, res, next) => {

    try {

        const { id } = req.params;

        const pedidos = await sql.query`

            SELECT
                p.id,
                p.fecha,
                p.estado,
                p.total,
                p.metodo_pago,
                p.tipo_envio

            FROM Pedidos p

            WHERE p.usuario_id = ${id}

            ORDER BY p.fecha DESC
        `;

        res.json({
            mensaje: 'Pedidos obtenidos correctamente',
            pedidos: pedidos.recordset
        });

    } catch (error) {

        next(error);

    }

};


module.exports = {
    crearPedido,
    actualizarEstadoPedido,
    verPedidosAdmin,
    verPedidosCliente,
    cancelarPedido,
    obtenerEstadisticasPedidos,
    obtenerPedidoPorId,
    obtenerPedidosPorUsuario
};