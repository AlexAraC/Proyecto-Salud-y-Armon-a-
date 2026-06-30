const { sql } = require('../config/db');
const bcrypt = require('bcrypt');


// =====================================
// BUSCAR O CREAR USUARIO VENTA FÍSICA
// =====================================

const obtenerVentasFisicoId = async () => {

    const correoVentas = 'ventas_fisico@tienda.com';

    let usuarioDB = await sql.query`

        SELECT id

        FROM Usuarios

        WHERE correo = ${correoVentas}
    `;

    if (usuarioDB.recordset.length === 0) {

        const hash = await bcrypt.hash('ventas_fisico_2024', 10);

        const nuevo = await sql.query`

            INSERT INTO Usuarios
                (nombre, correo, contraseña, rol)

            OUTPUT INSERTED.id

            VALUES
                ('Venta Física', ${correoVentas}, ${hash}, 'usuario')
        `;

        return nuevo.recordset[0].id;

    }

    return usuarioDB.recordset[0].id;

};


// =====================================
// REGISTRAR VENTA FÍSICA
// =====================================

const registrarVenta = async (req, res) => {

    try {

        const { productos, metodo_pago } = req.body;


        // =====================================
        // VALIDAR PRODUCTOS
        // =====================================

        if (!productos || productos.length === 0) {

            return res.status(400).json({
                mensaje: 'Debe incluir al menos un producto'
            });

        }


        // =====================================
        // OBTENER USUARIO VENTA FÍSICA
        // =====================================

        const usuario_id = await obtenerVentasFisicoId();


        // =====================================
        // PROCESAR PRODUCTOS
        // =====================================

        let total = 0;

        const productosProcesados = [];

        for (const item of productos) {

            const productoDB = await sql.query`

                SELECT
                    p.id,
                    p.nombre,
                    p.precio,
                    i.stock

                FROM Productos p

                INNER JOIN Inventario i
                    ON p.id = i.producto_id

                WHERE p.id = ${item.producto_id}
            `;

            if (productoDB.recordset.length === 0) {

                return res.status(404).json({
                    mensaje: `Producto ID ${item.producto_id} no existe`
                });

            }

            const producto = productoDB.recordset[0];

            if (item.cantidad > producto.stock) {

                return res.status(400).json({
                    mensaje: `Stock insuficiente para ${producto.nombre}`
                });

            }

            const subtotal = producto.precio * item.cantidad;

            total += subtotal;

            productosProcesados.push({
                producto_id: producto.id,
                nombre_producto: producto.nombre,
                cantidad: item.cantidad,
                subtotal
            });

        }


        // =====================================
        // CREAR PEDIDO (ENTREGADO DIRECTAMENTE)
        // =====================================

        const pedidoDB = await sql.query`

            INSERT INTO Pedidos
                (usuario_id, estado, total, metodo_pago, tipo_envio)

            OUTPUT INSERTED.id

            VALUES
                (${usuario_id}, 'Entregado', ${total}, ${metodo_pago || 'Efectivo'}, 'Normal')
        `;

        const pedidoId = pedidoDB.recordset[0].id;


        // =====================================
        // CREAR DETALLES + ACTUALIZAR INVENTARIO
        // =====================================

        for (const prod of productosProcesados) {

            await sql.query`

                INSERT INTO DetallePedido
                    (pedido_id, producto_id, nombre_producto, cantidad, subtotal)

                VALUES
                    (${pedidoId}, ${prod.producto_id}, ${prod.nombre_producto}, ${prod.cantidad}, ${prod.subtotal})
            `;

            await sql.query`

                UPDATE Inventario

                SET stock = stock - ${prod.cantidad}

                WHERE producto_id = ${prod.producto_id}
            `;

        }


        // =====================================
        // RESPUESTA
        // =====================================

        res.json({
            mensaje: 'Venta registrada correctamente',
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


module.exports = {
    registrarVenta
};
