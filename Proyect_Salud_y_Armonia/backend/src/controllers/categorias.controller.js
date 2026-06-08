const { sql } = require('../config/db');


// =====================================
// OBTENER CATEGORIAS
// =====================================

const verCategorias = async (req, res) => {

    try {

        const categorias = await sql.query(`
            SELECT * FROM Categorias WHERE activo = 1
        `);

        res.json(categorias.recordset);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            mensaje: 'Error obteniendo categorias'
        });

    }

};


// =====================================
// CREAR CATEGORIA
// =====================================

const crearCategoria = async (req, res) => {

    try {

        const { nombre } = req.body;

        await sql.query(`
            INSERT INTO Categorias (nombre)

            VALUES ('${nombre}')
        `);

        res.json({
            mensaje: 'Categoria creada'
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            mensaje: 'Error creando categoria'
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

        await sql.query(`
            UPDATE Categorias

            SET nombre = '${nombre}'

            WHERE id = ${id}
        `);

        res.json({
            mensaje: 'Categoria actualizada'
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            mensaje: 'Error actualizando categoria'
        });

    }

};


// =====================================
// ELIMINAR CATEGORIA
// =====================================

const eliminarCategoria = async (req, res) => {

    try {

        const { id } = req.params;

        await sql.query(`
           UPDATE Categorias 
           SET activo = 0
           WHERE id = ${id}
        `);

        res.json({
            mensaje: 'Categoria eliminada'
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            mensaje: 'Error eliminando categoria'
        });

    }

};


module.exports = {
    verCategorias,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria
};