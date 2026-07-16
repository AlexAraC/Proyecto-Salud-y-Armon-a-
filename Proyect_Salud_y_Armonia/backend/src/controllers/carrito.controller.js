const { sql } = require('../config/db');


// =====================================
// CONSTANTES
// =====================================

const METODOS_PAGO_VALIDOS = ['Efectivo', 'Tarjeta', 'Sinpe'];


// =====================================
// LIMPIAR PRODUCTOS INACTIVOS
// =====================================

const limpiarProductosInactivos = async (usuario_id) => {

    await sql.query`

        DELETE cd
        FROM CarritoDetalle cd
        INNER JOIN Carrito c
        ON cd.carrito_id = c.id
        INNER JOIN Productos p
        ON cd.producto_id = p.id
        WHERE c.usuario_id = ${usuario_id}
        AND c.estado = 'Activo'
        AND p.activo = 0
    `;

};


// =====================================
// OBTENER CARRITO DEL USUARIO
// =====================================

const obtenerCarritoPorUsuario = async (req, res) => {

    try {

        // =====================================
        // OBTENER USUARIO DEL TOKEN
        // =====================================

        const usuario_id = req.usuario.id;

        // =====================================
        // ELIMINAR PRODUCTOS INACTIVOS
        // =====================================

        await limpiarProductosInactivos(usuario_id);

        // =====================================
        // BUSCAR CARRITO ACTIVO
        // =====================================

        const carritoDB = await sql.query`

            SELECT
                c.id AS carrito_id,
                c.estado,
                c.fecha,

                cd.id AS detalle_id,
                cd.producto_id,
                cd.cantidad,

                p.nombre,
                p.descripcion,
                p.precio,

                (p.precio * cd.cantidad) AS subtotal

            FROM Carrito c

            INNER JOIN CarritoDetalle cd
            ON c.id = cd.carrito_id

            INNER JOIN Productos p
            ON cd.producto_id = p.id

            WHERE c.usuario_id = ${usuario_id}
            AND c.estado = 'Activo'
            AND p.activo = 1
        `;


        // =====================================
        // VALIDAR SI EXISTE CARRITO
        // =====================================

        if (carritoDB.recordset.length === 0) {

            return res.json({
                mensaje: 'El carrito está vacío',
                carrito: []
            });

        }


        // =====================================
        // CALCULAR TOTAL
        // =====================================

        let total = 0;

        for (const producto of carritoDB.recordset) {

            total += producto.subtotal;

        }


        // =====================================
        // RESPUESTA
        // =====================================

        res.json({

            mensaje: 'Carrito obtenido correctamente',

            total,

            carrito: carritoDB.recordset

        });


    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: 'Error interno del servidor'
        });

    }

};


// =====================================
// AGREGAR PRODUCTO AL CARRITO
// =====================================

const agregarProductoAlCarrito = async (req, res) => {

    try {

        // =====================================
        // OBTENER USUARIO DEL TOKEN
        // =====================================

        const usuario_id = req.usuario.id;


        // =====================================
        // OBTENER DATOS
        // =====================================

        const {
            producto_id,
            cantidad
        } = req.body;


        // =====================================
        // VALIDAR producto_id
        // =====================================

        if (!Number.isInteger(producto_id) || producto_id <= 0) {

            return res.status(400).json({
                mensaje: 'producto_id debe ser un número entero positivo'
            });

        }


        // =====================================
        // VALIDAR CANTIDAD
        // =====================================

        if (!Number.isInteger(cantidad) || cantidad <= 0) {

            return res.status(400).json({
                mensaje: 'La cantidad debe ser un número entero positivo'
            });

        }


        // =====================================
        // VALIDAR PRODUCTO EXISTE
        // =====================================

        const productoDB = await sql.query`

            SELECT
                id,
                nombre

            FROM Productos

            WHERE id = ${producto_id}
            AND activo = 1
        `;


        if (productoDB.recordset.length === 0) {

            return res.status(404).json({
                mensaje: 'Producto no encontrado'
            });

        }


        // =====================================
        // BUSCAR INVENTARIO
        // =====================================

        const inventarioDB = await sql.query`

            SELECT
                stock

            FROM Inventario

            WHERE producto_id = ${producto_id}
        `;


        // =====================================
        // VALIDAR INVENTARIO
        // =====================================

        if (inventarioDB.recordset.length === 0) {

            return res.status(404).json({
                mensaje: 'Inventario no encontrado'
            });

        }


        const stockDisponible =
            inventarioDB.recordset[0].stock;


        // =====================================
        // BUSCAR CARRITO ACTIVO
        // =====================================

        let carritoDB = await sql.query`

            SELECT
                id

            FROM Carrito

            WHERE usuario_id = ${usuario_id}
            AND estado = 'Activo'
        `;


        // =====================================
        // CREAR CARRITO SI NO EXISTE
        // =====================================

        if (carritoDB.recordset.length === 0) {

            carritoDB = await sql.query`

                INSERT INTO Carrito
                (
                    usuario_id,
                    estado
                )

                OUTPUT INSERTED.id

                VALUES
                (
                    ${usuario_id},
                    'Activo'
                )
            `;

        }


        // =====================================
        // OBTENER ID DEL CARRITO
        // =====================================

        const carritoId =
            carritoDB.recordset[0].id;


        // =====================================
        // VERIFICAR SI PRODUCTO YA EXISTE
        // =====================================

        const productoCarritoDB = await sql.query`

            SELECT
                id,
                cantidad

            FROM CarritoDetalle

            WHERE carrito_id = ${carritoId}
            AND producto_id = ${producto_id}
        `;


        // =====================================
        // SI YA EXISTE
        // =====================================

        if (productoCarritoDB.recordset.length > 0) {

            const cantidadActual =
                productoCarritoDB.recordset[0].cantidad;

            const nuevaCantidad =
                cantidadActual + cantidad;


            // =====================================
            // VALIDAR STOCK
            // =====================================

            if (nuevaCantidad > stockDisponible) {

                return res.status(400).json({
                    mensaje: 'Stock insuficiente'
                });

            }


            // =====================================
            // ACTUALIZAR CANTIDAD
            // =====================================

            await sql.query`

                UPDATE CarritoDetalle

                SET cantidad = ${nuevaCantidad}

                WHERE carrito_id = ${carritoId}
                AND producto_id = ${producto_id}
            `;

        }


        // =====================================
        // SI NO EXISTE
        // =====================================

        else {

            // =====================================
            // VALIDAR STOCK
            // =====================================

            if (cantidad > stockDisponible) {

                return res.status(400).json({
                    mensaje: 'Stock insuficiente'
                });

            }


            // =====================================
            // INSERTAR PRODUCTO
            // =====================================

            await sql.query`

                INSERT INTO CarritoDetalle
                (
                    carrito_id,
                    producto_id,
                    cantidad
                )

                VALUES
                (
                    ${carritoId},
                    ${producto_id},
                    ${cantidad}
                )
            `;

        }


        // =====================================
        // RESPUESTA
        // =====================================

        res.json({
            mensaje: 'Producto agregado al carrito'
        });


    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: 'Error interno del servidor'
        });

    }

};


// =====================================
// ACTUALIZAR CANTIDAD PRODUCTO
// =====================================

const actualizarCantidadProductoEnCarrito = async (req, res) => {

    try {

        // =====================================
        // OBTENER USUARIO DEL TOKEN
        // =====================================

        const usuario_id = req.usuario.id;


        // =====================================
        // OBTENER DATOS
        // =====================================

        const {
            producto_id,
            cantidad
        } = req.body;


        // =====================================
        // VALIDAR producto_id
        // =====================================

        if (!Number.isInteger(producto_id) || producto_id <= 0) {

            return res.status(400).json({
                mensaje: 'producto_id debe ser un número entero positivo'
            });

        }


        // =====================================
        // VALIDAR CANTIDAD
        // =====================================

        if (!Number.isInteger(cantidad) || cantidad <= 0) {

            return res.status(400).json({
                mensaje: 'La cantidad debe ser un número entero positivo'
            });

        }


        // =====================================
        // ELIMINAR PRODUCTOS INACTIVOS
        // =====================================

        await limpiarProductosInactivos(usuario_id);

        // =====================================
        // BUSCAR CARRITO ACTIVO
        // =====================================

        const carritoDB = await sql.query`

            SELECT
                id

            FROM Carrito

            WHERE usuario_id = ${usuario_id}
            AND estado = 'Activo'
        `;


        // =====================================
        // VALIDAR CARRITO
        // =====================================

        if (carritoDB.recordset.length === 0) {

            return res.status(404).json({
                mensaje: 'Carrito no encontrado'
            });

        }


        const carritoId =
            carritoDB.recordset[0].id;


        // =====================================
        // VALIDAR PRODUCTO EN CARRITO
        // =====================================

        const productoCarritoDB = await sql.query`

            SELECT
                cd.id

            FROM CarritoDetalle cd
            INNER JOIN Productos p
            ON cd.producto_id = p.id

            WHERE cd.carrito_id = ${carritoId}
            AND cd.producto_id = ${producto_id}
            AND p.activo = 1
        `;


        if (productoCarritoDB.recordset.length === 0) {

            return res.status(404).json({
                mensaje: 'Producto no está en el carrito o ya no está disponible'
            });

        }


        // =====================================
        // VALIDAR STOCK
        // =====================================

        const inventarioDB = await sql.query`

            SELECT
                stock

            FROM Inventario

            WHERE producto_id = ${producto_id}
        `;


        const stockDisponible =
            inventarioDB.recordset[0].stock;


        if (cantidad > stockDisponible) {

            return res.status(400).json({
                mensaje: 'Stock insuficiente'
            });

        }


        // =====================================
        // ACTUALIZAR CANTIDAD
        // =====================================

        await sql.query`

            UPDATE CarritoDetalle

            SET cantidad = ${cantidad}

            WHERE carrito_id = ${carritoId}
            AND producto_id = ${producto_id}
        `;


        // =====================================
        // RESPUESTA
        // =====================================

        res.json({
            mensaje: 'Cantidad actualizada correctamente'
        });


    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: 'Error interno del servidor'
        });

    }

};


// =====================================
// ELIMINAR PRODUCTO DEL CARRITO
// =====================================

const eliminarProductoDelCarrito = async (req, res) => {

    try {

        // =====================================
        // OBTENER USUARIO DEL TOKEN
        // =====================================

        const usuario_id = req.usuario.id;


        // =====================================
        // OBTENER PRODUCTO
        // =====================================

        const { producto_id } = req.params;


        // =====================================
        // VALIDAR producto_id
        // =====================================

        if (!Number.isInteger(Number(producto_id)) || Number(producto_id) <= 0) {

            return res.status(400).json({
                mensaje: 'ID de producto no válido'
            });

        }


        // =====================================
        // BUSCAR CARRITO ACTIVO
        // =====================================

        const carritoDB = await sql.query`

            SELECT
                id

            FROM Carrito

            WHERE usuario_id = ${usuario_id}
            AND estado = 'Activo'
        `;


        // =====================================
        // VALIDAR CARRITO
        // =====================================

        if (carritoDB.recordset.length === 0) {

            return res.status(404).json({
                mensaje: 'Carrito no encontrado'
            });

        }


        const carritoId =
            carritoDB.recordset[0].id;


        // =====================================
        // VALIDAR PRODUCTO EN CARRITO
        // =====================================

        const productoCarritoDB = await sql.query`

            SELECT
                id

            FROM CarritoDetalle

            WHERE carrito_id = ${carritoId}
            AND producto_id = ${producto_id}
        `;


        if (productoCarritoDB.recordset.length === 0) {

            return res.status(404).json({
                mensaje: 'Producto no encontrado en el carrito'
            });

        }


        // =====================================
        // ELIMINAR PRODUCTO
        // =====================================

        await sql.query`

            DELETE FROM CarritoDetalle

            WHERE carrito_id = ${carritoId}
            AND producto_id = ${producto_id}
        `;


        // =====================================
        // RESPUESTA
        // =====================================

        res.json({
            mensaje: 'Producto eliminado del carrito'
        });


    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: 'Error interno del servidor'
        });

    }

};


// =====================================
// VACIAR CARRITO
// =====================================

const vaciarCarrito = async (req, res) => {

    try {

        // =====================================
        // OBTENER USUARIO DEL TOKEN
        // =====================================

        const usuario_id = req.usuario.id;

        // =====================================
        // BUSCAR CARRITO ACTIVO
        // =====================================

        const carritoDB = await sql.query`

            SELECT
                id

            FROM Carrito

            WHERE usuario_id = ${usuario_id}
            AND estado = 'Activo'
        `;


        // =====================================
        // VALIDAR CARRITO
        // =====================================

        if (carritoDB.recordset.length === 0) {

            return res.status(404).json({
                mensaje: 'Carrito no encontrado'
            });

        }


        const carritoId =
            carritoDB.recordset[0].id;


        // =====================================
        // ELIMINAR PRODUCTOS DEL CARRITO
        // =====================================

        await sql.query`

            DELETE FROM CarritoDetalle

            WHERE carrito_id = ${carritoId}
        `;


        // =====================================
        // RESPUESTA
        // =====================================

        res.json({
            mensaje: 'Carrito vaciado correctamente'
        });


    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: 'Error interno del servidor'
        });

    }

};


// =====================================
// CONVERTIR CARRITO EN PEDIDO
// =====================================

const convertirCarritoAPedido = async (req, res) => {

    const transaction = new sql.Transaction();

    try {

        // =====================================
        // OBTENER USUARIO DEL TOKEN
        // =====================================

        const usuario_id = req.usuario.id;


        // =====================================
        // OBTENER DATOS
        // =====================================

        const { metodo_pago, tipo_envio, direccion_envio } = req.body;


        // =====================================
        // VALIDAR MÉTODO DE PAGO
        // =====================================

        if (!metodo_pago || !METODOS_PAGO_VALIDOS.includes(metodo_pago)) {

            return res.status(400).json({
                mensaje: `Método de pago no válido. Válidos: ${METODOS_PAGO_VALIDOS.join(', ')}`
            });

        }


        // =====================================
        // VERIFICAR QUE NO ESTÉ BANEADO
        // =====================================

        const usuarioDB = await sql.query`

            SELECT baneado, motivo_ban

            FROM Usuarios

            WHERE id = ${usuario_id}
        `;

        if (usuarioDB.recordset.length > 0 && usuarioDB.recordset[0].baneado) {

            return res.status(403).json({
                mensaje: `Tu cuenta ha sido suspendida. Motivo: ${usuarioDB.recordset[0].motivo_ban || 'No especificado'}`
            });

        }


        // =====================================
        // ELIMINAR PRODUCTOS INACTIVOS
        // =====================================

        await limpiarProductosInactivos(usuario_id);


        // =====================================
        // INICIAR TRANSACCIÓN
        // =====================================

        await transaction.begin();


        // =====================================
        // BUSCAR CARRITO ACTIVO (dentro de la transacción)
        // =====================================

        const carritoDB = await transaction.request().query`

            SELECT
                id

            FROM Carrito

            WHERE usuario_id = ${usuario_id}
            AND estado = 'Activo'
        `;

        if (carritoDB.recordset.length === 0) {

            await transaction.rollback();

            return res.status(404).json({
                mensaje: 'Carrito no encontrado'
            });

        }

        const carritoId = carritoDB.recordset[0].id;


        // =====================================
        // OBTENER PRODUCTOS DEL CARRITO
        // =====================================

        const productosDB = await transaction.request().query`

            SELECT
                cd.producto_id,
                cd.cantidad,

                p.nombre,
                p.precio

            FROM CarritoDetalle cd

            INNER JOIN Productos p
            ON cd.producto_id = p.id

            WHERE cd.carrito_id = ${carritoId}
            AND p.activo = 1
        `;


        if (productosDB.recordset.length === 0) {

            await transaction.rollback();

            return res.status(400).json({
                mensaje: 'El carrito está vacío'
            });

        }


        // =====================================
        // DESCONTAR STOCK Y CALCULAR TOTAL
        // =====================================

        let total = 0;

        const productosProcesados = [];

        for (const producto of productosDB.recordset) {

            // Descontar stock atómicamente
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
                    mensaje: `Stock insuficiente para ${producto.nombre}`
                });

            }

            const subtotal = producto.precio * producto.cantidad;

            total += subtotal;

            productosProcesados.push({
                producto_id: producto.producto_id,
                nombre_producto: producto.nombre,
                cantidad: producto.cantidad,
                subtotal
            });

        }


        // =====================================
        // CREAR PEDIDO
        // =====================================

        const pedidoDB = await transaction.request().query`

            INSERT INTO Pedidos
            (
                usuario_id,
                estado,
                total,
                metodo_pago,
                tipo_envio,
                direccion_envio
            )

            OUTPUT INSERTED.id

            VALUES
            (
                ${usuario_id},
                'Pendiente',
                ${total},
                ${metodo_pago},
                ${tipo_envio || 'Normal'},
                ${direccion_envio || null}
            )
        `;

        const pedidoId = pedidoDB.recordset[0].id;


        // =====================================
        // CREAR DETALLE PEDIDO
        // =====================================

        for (const producto of productosProcesados) {

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
                    ${producto.producto_id},
                    ${producto.nombre_producto},
                    ${producto.cantidad},
                    ${producto.subtotal}
                )
            `;

        }


        // =====================================
        // MARCAR CARRITO COMO COMPLETADO
        // =====================================

        await transaction.request().query`

            UPDATE Carrito

            SET estado = 'Completado'

            WHERE id = ${carritoId}
        `;


        // =====================================
        // ELIMINAR DETALLES CARRITO
        // =====================================

        await transaction.request().query`

            DELETE FROM CarritoDetalle

            WHERE carrito_id = ${carritoId}
        `;


        // =====================================
        // ACTUALIZAR DIRECCIÓN USUARIO
        // =====================================

        if (direccion_envio) {

            await transaction.request().query`

                UPDATE Usuarios
                SET direccion = ${direccion_envio}
                WHERE id = ${usuario_id}
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

        console.error(error);

        res.status(500).json({
            mensaje: 'Error interno del servidor'
        });

    }

};


// =====================================
// EXPORTAR FUNCIONES
// =====================================

module.exports = {
    obtenerCarritoPorUsuario,
    agregarProductoAlCarrito,
    actualizarCantidadProductoEnCarrito,
    eliminarProductoDelCarrito,
    vaciarCarrito,
    convertirCarritoAPedido
};