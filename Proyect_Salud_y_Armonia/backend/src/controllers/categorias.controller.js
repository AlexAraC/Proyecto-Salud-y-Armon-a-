const { sql } = require('../config/db');


// =====================================
// OBTENER CATEGORIAS
// =====================================

const verCategorias = async (req, res) => {

    try {

        const categorias = await sql.query`
            SELECT * FROM Categorias WHERE activo = 1
        `;

        res.json(categorias.recordset);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: 'Error interno del servidor'
        });

    }

};


// =====================================
// CREAR CATEGORIA
// =====================================

const crearCategoria = async (req, res) => {

    try {

        const { nombre } = req.body;

        await sql.query`
            INSERT INTO Categorias (nombre)

            VALUES (${nombre})
        `;

        res.json({
            mensaje: 'Categoria creada'
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: 'Error interno del servidor'
        });

    }

};


// =====================================
// ACTUALIZAR CATEGORIA
// =====================================

const actualizarCategoria = async (req, res) => {

    try {

        const { id } = req.params;

        const { nombre } = req.body;

        await sql.query`
            UPDATE Categorias

            SET nombre = ${nombre}

            WHERE id = ${id}
        `;

        res.json({
            mensaje: 'Categoria actualizada'
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: 'Error interno del servidor'
        });

    }

};


// =====================================
// ELIMINAR CATEGORIA
// =====================================

const eliminarCategoria = async (req, res) => {

    try {

        const { id } = req.params;

        const productosConCategoria = await sql.query`
            SELECT COUNT(*) AS total
            FROM Productos
            WHERE categoria_id = ${id}
        `;

        if (productosConCategoria.recordset[0].total > 0) {

            return res.status(400).json({
                mensaje: 'No se puede eliminar la categoría porque tiene productos asociados'
            });

        }

        await sql.query`
           UPDATE Categorias 
           SET activo = 0
           WHERE id = ${id}
        `;

        res.json({
            mensaje: 'Categoria eliminada'
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: 'Error interno del servidor'
        });

    }

};


module.exports = {
    verCategorias,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria
};