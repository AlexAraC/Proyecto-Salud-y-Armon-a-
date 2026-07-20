const { sql } = require('../config/db');


// =====================================
// OBTENER CATEGORIAS
// =====================================

const verCategorias = async (req, res, next) => {

    try {

        const categorias = await sql.query`
            SELECT * FROM Categorias WHERE activo = 1
        `;

        res.json(categorias.recordset);

    } catch (error) {

        next(error);

    }

};


// =====================================
// CREAR CATEGORIA
// =====================================

const crearCategoria = async (req, res, next) => {

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

        next(error);

    }

};


// =====================================
// ACTUALIZAR CATEGORIA
// =====================================

const actualizarCategoria = async (req, res, next) => {

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

        next(error);

    }

};


// =====================================
// ELIMINAR CATEGORIA
// =====================================

const eliminarCategoria = async (req, res, next) => {

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

        next(error);

    }

};


module.exports = {
    verCategorias,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria
};