const { sql } = require('../config/db');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const transporter = require('../config/mail');


const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


// =====================================
// OBTENER USUARIOS
// =====================================

const obtenerUsuarios = async (req, res, next) => {

    try {

        const usuarios = await sql.query`
            SELECT
                id,
                nombre,
                correo,
                rol,
                direccion,
                telefono,
                baneado,
                motivo_ban
            FROM Usuarios
            WHERE correo != 'ventas_fisico@tienda.com'
        `;

        res.json(usuarios.recordset);

    } catch (error) {

        next(error);

    }

};


// =====================================
// CREAR USUARIO
// =====================================

const crearUsuario = async (req, res, next) => {

    try {

        const {
            nombre,
            correo,
            contraseña,
            rol,
            direccion,
            telefono
        } = req.body;

        // =====================================
        // VALIDAR FORMATO DE CORREO
        // =====================================

        if (!emailRegex.test(correo)) {
            return res.status(400).json({
                mensaje: 'El correo no tiene un formato válido'
            });
        }

        // =====================================
        // VALIDAR CORREO ÚNICO
        // =====================================

        const existe = await sql.query`
            SELECT id FROM Usuarios
            WHERE correo = ${correo}
        `;

        if (existe.recordset.length > 0) {

            return res.status(400).json({
                mensaje: 'El correo ya está registrado'
            });

        }

        // =====================================
        // HASHEAR CONTRASEÑA
        // =====================================

        const salt = await bcrypt.genSalt(10);

        const passwordHash = await bcrypt.hash(
            contraseña,
            salt
        );

        // =====================================
        // GENERAR TOKEN DE VERIFICACIÓN
        // =====================================

        const tokenVerificacion = crypto.randomBytes(32).toString('hex');

        // =====================================
        // GUARDAR USUARIO
        // =====================================

        await sql.query`
            INSERT INTO Usuarios
            (
                nombre,
                correo,
                contraseña,
                rol,
                direccion,
                telefono,
                token_verificacion
            )

            VALUES
            (
                ${nombre},
                ${correo},
                ${passwordHash},
                ${rol},
                ${direccion},
                ${telefono},
                ${tokenVerificacion}
            )
        `;

        // =====================================
        // ENVIAR EMAIL DE VERIFICACIÓN
        // =====================================

        const urlVerificacion = `http://localhost:5173/verificar-correo?token=${tokenVerificacion}`;

        try {
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: correo,
                subject: 'Verifica tu correo - Salud y Armonía',
                html: `
                    <h1>¡Bienvenido a Salud y Armonía!</h1>
                    <p>Gracias por registrarte. Para completar tu registro, haz clic en el siguiente enlace:</p>
                    <a href="${urlVerificacion}" style="display:inline-block;padding:14px 28px;background:#6f8c4e;color:white;text-decoration:none;border-radius:8px;font-weight:700;margin:20px 0;">Verificar mi correo</a>
                    <p>Si no creaste esta cuenta, ignora este mensaje.</p>
                `
            });
        } catch (emailError) {
            // Error al enviar email, se ignora para no bloquear el registro
        }

        res.json({
            mensaje: 'Registro exitoso. Revisa tu correo para verificar tu cuenta.'
        });

    } catch (error) {

        if (error.number === 2627) {

            return res.status(400).json({
                mensaje: 'El correo ya está registrado'
            });

        }

        next(error);

    }

};


// =====================================
// ACTUALIZAR USUARIO
// =====================================

const actualizarUsuario = async (req, res, next) => {

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
            direccion,
            telefono
        } = req.body;

        // =====================================
        // VALIDAR FORMATO DE CORREO (si se envía)
        // =====================================

        if (correo && !emailRegex.test(correo)) {
            return res.status(400).json({
                mensaje: 'El correo no tiene un formato válido'
            });
        }

        // =====================================
        // VALIDAR CORREO ÚNICO (si se envía)
        // =====================================

        if (correo) {

            const existe = await sql.query`
                SELECT id FROM Usuarios
                WHERE correo = ${correo}
                  AND id != ${id}
            `;

            if (existe.recordset.length > 0) {

                return res.status(400).json({
                    mensaje: 'El correo ya está registrado por otro usuario'
                });

            }

        }

        // =====================================
        // HASHEAR CONTRASEÑA (si se envía)
        // =====================================

        let passwordHash;

        if (contraseña) {

            const salt = await bcrypt.genSalt(10);

            passwordHash = await bcrypt.hash(contraseña, salt);

        }

        // =====================================
        // ACTUALIZAR USUARIO
        // =====================================

        await sql.query`
            UPDATE Usuarios
            SET
                nombre = ${nombre},
                correo = ${correo},
                contraseña = ${passwordHash},
                direccion = ${direccion},
                telefono = ${telefono}
            WHERE id = ${id}
        `;

        // =====================================
        // RESPUESTA
        // =====================================

        res.json({
            mensaje: 'Usuario actualizado'
        });

    } catch (error) {

        next(error);

    }

};


// =====================================
// ELIMINAR USUARIO
// =====================================


const eliminarUsuario = async (req, res, next) => {

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
        // OBTENER USUARIO A ELIMINAR
        // =====================================

        const usuarioEliminar = await sql.query`

            SELECT rol

            FROM Usuarios

            WHERE id = ${id}

        `;

        if (usuarioEliminar.recordset.length === 0) {

            return res.status(404).json({
                mensaje: 'Usuario no encontrado'
            });

        }

        const rolEliminar = usuarioEliminar.recordset[0].rol;

        // =====================================
        // CONTAR ADMINISTRADORES
        // =====================================

        if (rolEliminar === 'admin') {

            const admins = await sql.query`

                SELECT COUNT(*) AS total

                FROM Usuarios

                WHERE rol = 'admin'

            `;

            if (admins.recordset[0].total === 1) {

                return res.status(400).json({
                    mensaje: 'No se puede eliminar el último administrador del sistema'
                });

            }

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

        next(error);

    }

};

const cambiarRol = async (req, res, next) => {

    try {

        const { id } = req.params;
        const { rol } = req.body;

        const idUsuarioActual = req.usuario.id;


        // =====================================
        // ROLES PERMITIDOS
        // =====================================

        const rolesValidos = [
            'admin',
            'usuario'
        ];

        if (!rolesValidos.includes(rol)) {

            return res.status(400).json({
                mensaje: 'Rol no válido'
            });

        }


        // =====================================
        // VALIDAR USUARIO EXISTE
        // =====================================

        const usuarioDB = await sql.query`

            SELECT id, rol

            FROM Usuarios

            WHERE id = ${id}

        `;

        if (usuarioDB.recordset.length === 0) {

            return res.status(404).json({
                mensaje: 'Usuario no encontrado'
            });

        }


        // =====================================
        // OBTENER ROL ACTUAL
        // =====================================

        const rolActual = usuarioDB.recordset[0].rol;


        // =====================================
        // IMPEDIR QUITARSE EL PROPIO ROL
        // =====================================

        if (
            parseInt(id) === idUsuarioActual &&
            rolActual === 'admin' &&
            rol === 'usuario'
        ) {

            return res.status(400).json({
                mensaje: 'No puedes quitarte a ti mismo los permisos de administrador'
            });

        }


        // =====================================
        // ASEGURAR QUE SIEMPRE EXISTA UN ADMIN
        // =====================================

        if (
            rolActual === 'admin' &&
            rol === 'usuario'
        ) {

            const admins = await sql.query`

                SELECT COUNT(*) AS total

                FROM Usuarios

                WHERE rol = 'admin'

            `;

            if (admins.recordset[0].total === 1) {

                return res.status(400).json({
                    mensaje: 'Debe existir al menos un administrador en el sistema'
                });

            }

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

        next(error);

    }

};

const obtenerMiPerfil = async (req, res, next) => {

    try {

        const { id } = req.usuario;

        const usuario = await sql.query`
            SELECT
                id,
                nombre,
                correo,
                rol,
                direccion,
                telefono,
                baneado,
                motivo_ban
            FROM Usuarios
            WHERE id = ${id}
        `;

        if (usuario.recordset.length === 0) {
            return res.status(404).json({
                mensaje: 'Usuario no encontrado'
            });
        }

        res.json(usuario.recordset[0]);

    } catch (error) {

        next(error);

    }

};

const verificarAdministrador = async (req, res) => {

    res.json({
        admin: true
    });

};

const verificarCorreo = async (req, res, next) => {

    try {

        const { token } = req.params;

        const resultado = await sql.query`
            SELECT id, verificado
            FROM Usuarios
            WHERE token_verificacion = ${token}
        `;

        if (resultado.recordset.length === 0) {
            return res.status(400).json({
                mensaje: 'Token de verificación inválido'
            });
        }

        const usuario = resultado.recordset[0];

        if (usuario.verificado) {
            return res.json({
                mensaje: 'El correo ya está verificado'
            });
        }

        await sql.query`
            UPDATE Usuarios
            SET verificado = 1, token_verificacion = NULL
            WHERE id = ${usuario.id}
        `;

        res.json({
            mensaje: 'Correo verificado correctamente'
        });

    } catch (error) {

        next(error);

    }

};


const banearUsuario = async (req, res, next) => {

    try {

        const { id } = req.params;
        const { baneado, motivo } = req.body;

        const usuarioDB = await sql.query`

            SELECT id, rol

            FROM Usuarios

            WHERE id = ${id}
        `;

        if (usuarioDB.recordset.length === 0) {

            return res.status(404).json({
                mensaje: 'Usuario no encontrado'
            });

        }

        if (usuarioDB.recordset[0].rol === 'admin') {

            return res.status(400).json({
                mensaje: 'No se puede banear a un administrador'
            });

        }

        if (baneado && !motivo) {

            return res.status(400).json({
                mensaje: 'Debe especificar un motivo para el baneo'
            });

        }

        await sql.query`

            UPDATE Usuarios

            SET baneado = ${baneado ? 1 : 0},
                motivo_ban = ${baneado ? motivo : null}

            WHERE id = ${id}
        `;

        res.json({
            mensaje: baneado
                ? 'Usuario baneado correctamente'
                : 'Usuario desbaneado correctamente'
        });

    } catch (error) {

        next(error);

    }

};

module.exports = {
    obtenerUsuarios,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario,
    cambiarRol,
    banearUsuario,
    verificarAdministrador,
    verificarCorreo,
    obtenerMiPerfil

};