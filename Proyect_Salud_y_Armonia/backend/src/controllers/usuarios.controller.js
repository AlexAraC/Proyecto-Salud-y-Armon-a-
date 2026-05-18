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

        const usuarioTokenId = req.usuario.id;


        // =====================================
        // VALIDAR MISMO USUARIO
        // =====================================

        if (parseInt(id) !== usuarioTokenId) {

            return res.status(403).json({
                mensaje: 'Accion no permitida'
            });

        }


        const {
            nombre,
            correo,
            contraseña,
            direccion
        } = req.body;


        // =====================================
        // ACTUALIZAR USUARIO
        // =====================================

        await sql.query`

            UPDATE Usuarios

            SET
                nombre = ${nombre},
                correo = ${correo},
                contraseña = ${contraseña},
                direccion = ${direccion}

            WHERE id = ${id}
        `;


        // =====================================
        // RESPUESTA
        // =====================================

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

        const usuarioTokenId = req.usuario.id;

        const usuarioRol = req.usuario.rol;


        // =====================================
        // VALIDAR PERMISOS
        // =====================================

        if (
            parseInt(id) !== usuarioTokenId &&
            usuarioRol !== 'admin'
        ) {

            return res.status(403).json({
                mensaje: 'No tienes permisos para eliminar este usuario'
            });

        }


        // =====================================
        // ELIMINAR USUARIO
        // =====================================

        await sql.query`

            DELETE FROM Usuarios

            WHERE id = ${id}
        `;


        // =====================================
        // RESPUESTA
        // =====================================

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
const cambiarRol = async (req, res) => {

    try {

        const { id } = req.params;

        const { rol } = req.body;


        // =====================================
        // ROLES PERMITIDOS
        // =====================================

        const rolesValidos = [
            'admin',
            'usuario'
        ];


        // =====================================
        // VALIDAR ROL
        // =====================================

        if (!rolesValidos.includes(rol)) {

            return res.status(400).json({
                mensaje: 'Rol no válido'
            });

        }


        // =====================================
        // VALIDAR USUARIO EXISTE
        // =====================================

        const usuarioDB = await sql.query`

            SELECT id

            FROM Usuarios

            WHERE id = ${id}
        `;


        if (usuarioDB.recordset.length === 0) {

            return res.status(404).json({
                mensaje: 'Usuario no encontrado'
            });

        }


        // =====================================
        // ACTUALIZAR ROL
        // =====================================

        await sql.query`

            UPDATE Usuarios

            SET rol = ${rol}

            WHERE id = ${id}
        `;


        // =====================================
        // RESPUESTA
        // =====================================

        res.json({
            mensaje: 'Rol del usuario actualizado'
        });


    } catch (error) {

        console.log(error);

        res.status(500).json({
            mensaje: 'Error cambiando rol del usuario'
        });

    }

};
module.exports = {
    obtenerUsuarios,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario,
    cambiarRol
};