const { sql } = require('../config/db');


const actualizarStock = async (req, res) => {

    try {

        const {
            producto_id,
            nuevo_stock
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
        // VALIDAR nuevo_stock
        // =====================================

        if (!Number.isInteger(nuevo_stock) || nuevo_stock < 0) {

            return res.status(400).json({
                mensaje: 'nuevo_stock debe ser un número entero mayor o igual a 0'
            });

        }


        // =====================================
        // ACTUALIZAR STOCK
        // =====================================

        const resultado = await sql.query`

            UPDATE Inventario

            SET stock = ${nuevo_stock}

            WHERE producto_id = ${producto_id}
        `;

        // =====================================
        // VERIFICAR QUE EL PRODUCTO EXISTA
        // =====================================

        if (resultado.rowsAffected[0] === 0) {

            return res.status(404).json({
                mensaje: 'Producto no encontrado en el inventario'
            });

        }


        res.status(200).json({
            mensaje: 'Stock actualizado correctamente'
        });


    } catch (error) {

        console.error('Error al actualizar el stock:', error);

        res.status(500).json({
            mensaje: 'Error interno del servidor'
        });

    }

};


const obtenerStocks = async (req, res) => {

    try {

        const stocks = await sql.query`

            SELECT
                i.id,
                i.producto_id,
                p.nombre,
                i.stock

            FROM Inventario i

            INNER JOIN Productos p
            ON i.producto_id = p.id
        `;


        res.status(200).json({
            mensaje: 'Stocks obtenidos correctamente',
            stocks: stocks.recordset
        });


    } catch (error) {

        console.error('Error al obtener el stock:', error);

        res.status(500).json({
            mensaje: 'Error interno del servidor'
        });

    }

};


module.exports = {
    actualizarStock,
    obtenerStocks
};