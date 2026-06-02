const sql = require('mssql');

const obtenerEstadisticas = async (req, res) => {

    try {

        // ==========================
        // VENTAS ÚLTIMOS 3 MESES
        // ==========================

        const ventasQuery = `
            SELECT
                YEAR(fecha) AS año,
                MONTH(fecha) AS mes,
                SUM(total) AS ventas
            FROM Pedidos
            WHERE fecha >= DATEADD(MONTH, -3, GETDATE())
            GROUP BY
                YEAR(fecha),
                MONTH(fecha)
            ORDER BY
                año,
                mes
        `;

        const ventasResult = await sql.query(ventasQuery);

        // ==========================
        // PRODUCTOS MÁS VENDIDOS
        // ==========================

        const productosQuery = `
            SELECT TOP 5
                nombre_producto,
                SUM(cantidad) AS vendidos
            FROM DetallePedido
            GROUP BY nombre_producto
            ORDER BY vendidos DESC
        `;

        const productosResult = await sql.query(productosQuery);

        // ==========================
        // RESPUESTA
        // ==========================

        res.status(200).json({

            ventas: ventasResult.recordset,

            productos: productosResult.recordset

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            mensaje: 'Error al obtener estadísticas',

            error: error.message

        });

    }

};

module.exports = {

    obtenerEstadisticas

};