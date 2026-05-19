const { sql } = require('../config/db');

const actualizarStock = async (req, res) => {

    try {

        const {
            producto_id,
            nuevo_stock
        } = req.body;


        await sql.query`

            UPDATE Inventario

            SET stock = ${nuevo_stock}

            WHERE producto_id = ${producto_id}
        `;


        res.status(200).json({
            message: 'Stock actualizado correctamente'
        });


    } catch (error) {

        console.error('Error al actualizar el stock:', error);

        res.status(500).json({
            message: 'Error al actualizar el stock'
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
        `;//UNIMOS LAS TABLAS INVENTARIO Y PRODUCTOS PARA OBTENER EL NOMBRE DEL PRODUCTO JUNTO CON SU STOCK


        res.status(200).json({
            mensaje: 'Stocks obtenidos correctamente',
            stocks: stocks.recordset
        });


    } catch (error) {

        console.error('Error al obtener el stock:', error);

        res.status(500).json({
            message: 'Error al obtener el stock'
        });

    }

};
module.exports = {
    actualizarStock,
    obtenerStocks
};