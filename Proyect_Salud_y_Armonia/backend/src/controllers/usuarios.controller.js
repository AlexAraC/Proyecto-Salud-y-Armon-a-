const { sql } = require('../config/db');
const bcrypt = require('bcrypt');
// =====================================
// OBTENER USUARIOS
// =====================================

const obtenerUsuarios = async (req, res) => {

    try {

        const usuarios = await sql.query(`
            SELECT
                id,
                nombre,
                correo,
                contraseña,
                rol,
                direccion

            FROM Usuarios
        `);

        res.json(usuarios.recordset);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            mensaje: 'Error obteniendo usuarios'
        });

    }

};


// =====================================
// CREAR USUARIO
// =====================================

const crearUsuario = async (req, res) => {

    try {

        const {
            nombre,
            correo,
            contraseña,
            rol,
            direccion
        } = req.body;

        // =====================================
        // HASHEAR CONTRASEÑA
        // =====================================

        const salt = await bcrypt.genSalt(10);

        const passwordHash = await bcrypt.hash(
            contraseña,
            salt
        );

        // =====================================
        // GUARDAR USUARIO
        // =====================================

        await sql.query(`
            INSERT INTO Usuarios
            (
                nombre,
                correo,
                contraseña,
                rol,
                direccion
            )

            VALUES
            (
                '${nombre}',
                '${correo}',
                '${passwordHash}',
                '${rol}',
                '${direccion}'
            )
        `);

        res.json({
            mensaje: 'Usuario creado'
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            mensaje: 'Error creando usuario'
        });

    }

};

// =====================================
// ACTUALIZAR USUARIO
// =====================================

const actualizarUsuario = async (req, res) => {

    try {

        const { id } = req.params;

        const {
            nombre,
            correo,
            contraseña,
            rol,
            direccion
        } = req.body;

        await sql.query(`
            UPDATE Usuarios

            SET
                nombre = '${nombre}',
                correo = '${correo}',
                contraseña = '${contraseña}',
                rol = '${rol}',
                direccion = '${direccion}'

            WHERE id = ${id}
        `);

        res.json({
            mensaje: 'Usuario actualizado'
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            mensaje: 'Error actualizando usuario'
        });

    }

};


// =====================================
// ELIMINAR USUARIO
// =====================================

const eliminarUsuario = async (req, res) => {

    try {

        const { id } = req.params;

        await sql.query(`
            DELETE FROM Usuarios

            WHERE id = ${id}
        `);

        res.json({
            mensaje: 'Usuario eliminado'
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            mensaje: 'Error eliminando usuario'
        });

    }

};


module.exports = {
    obtenerUsuarios,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario
};