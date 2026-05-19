const { sql } = require('../config/db');


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

        console.log(error);

        res.status(500).json({
            mensaje: error.message
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
        // VALIDAR CANTIDAD
        // =====================================

        if (cantidad <= 0) {

            return res.status(400).json({
                mensaje: 'Cantidad inválida'
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

        console.log(error);

        res.status(500).json({
            mensaje: error.message
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
        // VALIDAR CANTIDAD
        // =====================================

        if (cantidad <= 0) {

            return res.status(400).json({
                mensaje: 'Cantidad inválida'
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
                mensaje: 'Producto no está en el carrito'
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

        console.log(error);

        res.status(500).json({
            mensaje: error.message
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

        const { producto_id } = req.body;


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

        console.log(error);

        res.status(500).json({
            mensaje: error.message
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

        console.log(error);

        res.status(500).json({
            mensaje: error.message
        });

    }

};

// =====================================
// CONVERTIR CARRITO EN PEDIDO
// =====================================

const convertirCarritoAPedido = async (req, res) => {

    try {

        // =====================================
        // OBTENER USUARIO DEL TOKEN
        // =====================================

        const usuario_id = req.usuario.id;


        // =====================================
        // OBTENER MÉTODO DE PAGO
        // =====================================

        const { metodo_pago } = req.body;


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
        // OBTENER PRODUCTOS DEL CARRITO
        // =====================================

        const productosDB = await sql.query`

            SELECT
                cd.producto_id,
                cd.cantidad,

                p.nombre,
                p.precio

            FROM CarritoDetalle cd

            INNER JOIN Productos p
            ON cd.producto_id = p.id

            WHERE cd.carrito_id = ${carritoId}
        `;


        // =====================================
        // VALIDAR CARRITO VACÍO
        // =====================================

        if (productosDB.recordset.length === 0) {

            return res.status(400).json({
                mensaje: 'El carrito está vacío'
            });

        }


        // =====================================
        // CALCULAR TOTAL
        // =====================================

        let total = 0;

        const productosProcesados = [];


        for (const producto of productosDB.recordset) {

            const subtotal =
                producto.precio * producto.cantidad;

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

        const pedidoDB = await sql.query`

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
                'Pendiente',
                ${total},
                ${metodo_pago}
            )
        `;


        const pedidoId =
            pedidoDB.recordset[0].id;


        // =====================================
        // CREAR DETALLE PEDIDO
        // =====================================

        for (const producto of productosProcesados) {

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
        // CAMBIAR ESTADO CARRITO
        // =====================================

        await sql.query`

            UPDATE Carrito

            SET estado = 'Completado'

            WHERE id = ${carritoId}
        `;


        // =====================================
        // ELIMINAR DETALLES CARRITO
        // =====================================

        await sql.query`

            DELETE FROM CarritoDetalle

            WHERE carrito_id = ${carritoId}
        `;


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