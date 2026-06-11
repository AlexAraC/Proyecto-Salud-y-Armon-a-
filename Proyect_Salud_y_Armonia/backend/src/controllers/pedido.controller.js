const { sql } = require('../config/db');


// =====================================
// CREAR PEDIDO
// =====================================

const crearPedido = async (req, res) => {

    try {

        const { id } = req.usuario;

        const {
            metodo_pago,
            productos
        } = req.body;


        // =====================================
        // VARIABLES
        // =====================================

        let total = 0;

        const productosProcesados = [];


        // =====================================
        // RECORRER PRODUCTOS
        // =====================================

        for (const producto of productos) {


            // =====================================
            // BUSCAR PRODUCTO + INVENTARIO
            // =====================================

            const productoDB = await sql.query`

                SELECT
                    p.id,
                    p.nombre,
                    p.precio,
                    i.stock

                FROM Productos p

                INNER JOIN Inventario i
                ON p.id = i.producto_id

                WHERE p.id = ${producto.producto_id}
            `;


            // =====================================
            // VALIDAR EXISTENCIA
            // =====================================

            if (productoDB.recordset.length === 0) {

                return res.status(404).json({
                    mensaje: `Producto ${producto.producto_id} no existe`
                });

            }


            // =====================================
            // DATOS REALES DESDE SQL
            // =====================================

            const productoReal = productoDB.recordset[0];


            // =====================================
            // VALIDAR STOCK
            // =====================================

            if (producto.cantidad > productoReal.stock) {

                return res.status(400).json({
                    mensaje: `Stock insuficiente para ${productoReal.nombre}`
                });

            }


            // =====================================
            // CALCULAR SUBTOTAL
            // =====================================

            const subtotal =
                productoReal.precio * producto.cantidad;


            // =====================================
            // SUMAR TOTAL
            // =====================================

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

        const pedido = await sql.query`

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
                ${usuario_id},
                ${estado},
                ${total},
                ${metodo_pago}
            )
        `;


        // =====================================
        // OBTENER ID PEDIDO
        // =====================================

        const pedidoId = pedido.recordset[0].id;


        // =====================================
        // CREAR DETALLES + ACTUALIZAR INVENTARIO
        // =====================================

        for (const producto of productosProcesados) {

            // =====================================
            // CREAR DETALLE PEDIDO
            // =====================================

            await sql.query`

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
                    ${producto.producto_id},
                    ${producto.nombre_producto},
                    ${producto.cantidad},
                    ${producto.subtotal}
                )
            `;


            // =====================================
            // ACTUALIZAR INVENTARIO
            // =====================================

            await sql.query`

                UPDATE Inventario

                SET stock = stock - ${producto.cantidad}

                WHERE producto_id = ${producto.producto_id}
            `;

        }


        // =====================================
        // RESPUESTA
        // =====================================

        res.json({

            mensaje: 'Pedido creado correctamente',

            pedidoId,

            total

        });


    } catch (error) {

        console.log(error);

        res.status(500).json({
            mensaje: error.message
        });

    }

};

const cancelarPedido = async (req, res) => {

    try {

        const { id } = req.params;// ID DEL PEDIDO A CANCELAR

        const { id: usuarioId } = req.usuario;// ID DEL USUARIO QUE HACE LA SOLICITUD


        // =====================================
        // BUSCAR PEDIDO
        // =====================================

        const pedidoDB = await sql.query`

            SELECT
                id,
                usuario_id,
                estado

            FROM Pedidos

            WHERE id = ${id}
        `;


        // =====================================
        // VALIDAR EXISTENCIA
        // =====================================

        if (pedidoDB.recordset.length === 0) {

            return res.status(404).json({
                mensaje: 'Pedido no encontrado'
            });

        }


        const pedido = pedidoDB.recordset[0];


        // =====================================
        // VALIDAR DUEÑO DEL PEDIDO
        // =====================================

        if (pedido.usuario_id !== usuarioId) {

            return res.status(403).json({
                mensaje: 'No puedes cancelar este pedido'
            });

        }


        // =====================================
        // VALIDAR YA CANCELADO
        // =====================================

        if (pedido.estado === 'Cancelado') {

            return res.status(400).json({
                mensaje: 'El pedido ya está cancelado'
            });

        }


        // =====================================
        // OBTENER DETALLES DEL PEDIDO
        // =====================================

        const detallesDB = await sql.query`

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

            await sql.query`

                UPDATE Inventario

                SET stock = stock + ${detalle.cantidad}

                WHERE producto_id = ${detalle.producto_id}
            `;

        }


        // =====================================
        // ACTUALIZAR ESTADO
        // =====================================

        await sql.query`

            UPDATE Pedidos

            SET estado = 'Cancelado'

            WHERE id = ${id}
        `;


        // =====================================
        // RESPUESTA
        // =====================================

        res.json({
            mensaje: 'Pedido cancelado correctamente'
        });


    } catch (error) {

        console.log(error);

        res.status(500).json({
            mensaje: error.message
        });

    }

};

const obtenerPedidoPorId = async (req, res) => {

    try {

        const { id } = req.params;

        const pedidoDB = await sql.query`

            SELECT
                p.id,
                p.usuario_id,
                p.fecha,
                p.estado,
                p.total,
                p.metodo_pago

            FROM Pedidos p

            WHERE p.id = ${id}
        `;

        if (pedidoDB.recordset.length === 0) {

            return res.status(404).json({
                mensaje: 'Pedido no encontrado'
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

            pedido:
                pedidoDB.recordset[0],

            productos:
                productosDB.recordset

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            mensaje: error.message
        });

    }

};

const actualizarEstadoPedido = async (req, res) => {

    try {

        const { id } = req.params;

        const { estado } = req.body;


        // =====================================
        // ESTADOS PERMITIDOS
        // =====================================

      const estadosValidos = [
            'Pendiente',
            'Enviado',
            'Entregado',
            'Cancelado'
        ];


        // =====================================
        // VALIDAR ESTADO
        // =====================================

        if (!estadosValidos.includes(estado)) {

            return res.status(400).json({
                mensaje: 'Estado no válido'
            });

        }


        // =====================================
        // VALIDAR PEDIDO EXISTE
        // =====================================

        const pedidoDB = await sql.query`

            SELECT id

            FROM Pedidos

            WHERE id = ${id}
        `;


        if (pedidoDB.recordset.length === 0) {

            return res.status(404).json({
                mensaje: 'Pedido no encontrado'
            });

        }


        // =====================================
        // ACTUALIZAR ESTADO
        // =====================================

        await sql.query`

            UPDATE Pedidos

            SET estado = ${estado}

            WHERE id = ${id}
        `;


        // =====================================
        // RESPUESTA
        // =====================================

        res.json({
            mensaje: 'Estado actualizado correctamente'
        });


    } catch (error) {

        console.log(error);

        res.status(500).json({
            mensaje: error.message
        });

    }

};
const verPedidosAdmin = async (req, res) => {

    try {

        const todosLosPedidos = await sql.query`

            SELECT

                p.id,

                u.nombre AS usuario,

                p.fecha,

                p.estado,

                p.total,

                p.metodo_pago

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

    }

    catch (error) {

        console.log(error);

        res.status(500).json({

            mensaje: error.message

        });

    }

};
const verPedidosCliente = async (req, res) => {

    try {

        const { id } = req.usuario;

        const pedidosCliente = await sql.query`

            SELECT
                p.id,
                p.fecha,
                p.estado,
                p.total,
                p.metodo_pago

            FROM Pedidos p

            WHERE p.usuario_id = ${id}

            ORDER BY p.fecha DESC

        `;

        res.json({

            mensaje: 'Pedidos obtenidos correctamente',

            pedidos: pedidosCliente.recordset

        });

    }

    catch (error) {

        console.log(error);

        res.status(500).json({

            mensaje: error.message

        });

    }

};






const obtenerEstadisticasPedidos = async (req, res) => {

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

            pedidosPorMes:
                pedidosPorMes.recordset,

            productosMasVendidos:
                productosMasVendidos.recordset

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            mensaje: error.message

        });

    }

};

const obtenerPedidosPorUsuario = async (req, res) => {

    try {

        const { id } = req.params;

        const pedidos = await sql.query`

            SELECT
                p.id,
                p.fecha,
                p.estado,
                p.total,
                p.metodo_pago

            FROM Pedidos p

            WHERE p.usuario_id = ${id}

            ORDER BY p.fecha DESC
        `;

        res.json({

            mensaje: 'Pedidos obtenidos correctamente',

            pedidos: pedidos.recordset

        });

    }

    catch (error) {

        console.log(error);

        res.status(500).json({

            mensaje: error.message

        });

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