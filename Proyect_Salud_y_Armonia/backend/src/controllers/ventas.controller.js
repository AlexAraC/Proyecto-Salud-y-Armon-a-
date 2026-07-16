const { sql } = require('../config/db');
const bcrypt = require('bcrypt');


// =====================================
// BUSCAR O CREAR USUARIO VENTA FÍSICA
// =====================================

const obtenerVentasFisicoId = async (transaction) => {

    const correoVentas = 'ventas_fisico@tienda.com';

    let usuarioDB = await transaction.request().query`

        SELECT id

        FROM Usuarios

        WHERE correo = ${correoVentas}
    `;

    if (usuarioDB.recordset.length === 0) {

        const hash = await bcrypt.hash('ventas_fisico_2024', 10);

        const nuevo = await transaction.request().query`

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

    const transaction = new sql.Transaction();

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
        // INICIAR TRANSACCIÓN
        // =====================================

        await transaction.begin();


        // =====================================
        // OBTENER USUARIO VENTA FÍSICA
        // =====================================

        const usuario_id = await obtenerVentasFisicoId(transaction);


        // =====================================
        // PROCESAR PRODUCTOS (UPDATE ATÓMICO)
        // =====================================
        //
        // Se usa UPDATE con OUTPUT y WHERE stock >= cantidad
        // para verificar y descontar stock en una sola operación
        // atómica, eliminando el race condition.
        // =====================================

        let total = 0;

        const productosProcesados = [];

        for (const item of productos) {

            // 1) Validar formato de cantidad
            if (!Number.isInteger(item.cantidad) || item.cantidad <= 0) {

                await transaction.rollback();

                return res.status(400).json({
                    mensaje: 'La cantidad debe ser un número entero positivo'
                });

            }

            // 2) Obtener datos del producto (nombre, precio) — solo lectura
            const productoDB = await transaction.request().query`

                SELECT
                    p.id,
                    p.nombre,
                    p.precio

                FROM Productos p

                WHERE p.id = ${item.producto_id}
            `;

            if (productoDB.recordset.length === 0) {

                await transaction.rollback();

                return res.status(404).json({
                    mensaje: `Producto ID ${item.producto_id} no existe`
                });

            }

            const producto = productoDB.recordset[0];

            // 2) Descontar stock atómicamente (solo si hay suficiente stock)
            const updateResult = await transaction.request().query`

                UPDATE Inventario

                SET stock = stock - ${item.cantidad}

                OUTPUT INSERTED.stock

                WHERE producto_id = ${item.producto_id}
                  AND stock >= ${item.cantidad}
            `;

            // Si no se afectó ninguna fila, no había stock suficiente
            if (updateResult.rowsAffected[0] === 0) {

                await transaction.rollback();

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

        const pedidoDB = await transaction.request().query`

            INSERT INTO Pedidos
                (usuario_id, estado, total, metodo_pago, tipo_envio)

            OUTPUT INSERTED.id

            VALUES
                (${usuario_id}, 'Entregado', ${total}, ${metodo_pago || 'Efectivo'}, 'Normal')
        `;

        const pedidoId = pedidoDB.recordset[0].id;


        // =====================================
        // CREAR DETALLES
        // =====================================

        for (const prod of productosProcesados) {

            await transaction.request().query`

                INSERT INTO DetallePedido
                    (pedido_id, producto_id, nombre_producto, cantidad, subtotal)

                VALUES
                    (${pedidoId}, ${prod.producto_id}, ${prod.nombre_producto}, ${prod.cantidad}, ${prod.subtotal})
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
            mensaje: 'Venta registrada correctamente',
            pedidoId,
            total
        });


    } catch (error) {

        // =====================================
        // REVERTIR TRANSACCIÓN EN CASO DE ERROR
        // =====================================

        try {
            await transaction.rollback();
        } catch (rollbackError) {
            // Si la transacción ya fue revertida, ignorar el error
        }

        console.error(error);

        res.status(500).json({
            mensaje: 'Error interno del servidor'
        });

    }

};


module.exports = {
    registrarVenta
};