const { sql } = require('../config/db');


// =====================================
// CREAR PEDIDO
// =====================================

const crearPedido = async (req, res) => {

    try {

        const {
            usuario_id,
            metodo_pago,
            estado = 'Pendiente',
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
            // BUSCAR PRODUCTO EN SQL
            // =====================================

            const productoDB = await sql.query`

                SELECT
                    id,
                    nombre,
                    precio

                FROM Productos

                WHERE id = ${producto.producto_id}
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
        // CREAR DETALLES
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

        const todosLosPedidos = await sql.query(`

            SELECT
                p.id,
                p.usuario_id,
                p.fecha,
                p.estado,
                p.total,
                p.metodo_pago

            FROM Pedidos p
        `);


        res.json({

            mensaje: 'Pedidos obtenidos correctamente',

            pedidos: todosLosPedidos.recordset

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            mensaje: error.message
        });

    }

};
const verPedidosCliente = async (req, res) => {
    try {
        const { id } = req.usuario;

        const pedidosCliente = await sql.query(`
            SELECT
                p.id,
                p.fecha,
                p.estado,
                p.total,
                p.metodo_pago
            FROM Pedidos p
            WHERE p.usuario_id = ${id}
        `);

        res.json({
            mensaje: 'Pedidos obtenidos correctamente',
            pedidos: pedidosCliente.recordset
        });

    } catch (error) {
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
    verPedidosCliente
};


