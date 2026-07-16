/* Controlador de autenticación. Maneja login, logout, recuperación de contraseña y cambio de contraseña. */
const { sql } = require('../config/db');

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const transporter = require('../config/mail');


/**
 * Inicia sesión del usuario.
 * @param {Object} req.body - { correo, contraseña }
 * @returns {Object} Token JWT y mensaje de éxito.
 * Endpoint: POST /api/auth/login
 */
const login = async (req, res) => {

    try {

        const {
            correo,
            contraseña
        } = req.body;


        // =====================================
        // BUSCAR USUARIO
        // =====================================

        const resultado = await sql.query`

            SELECT *

            FROM Usuarios

            WHERE correo = ${correo}
        `;


        const usuario = resultado.recordset[0];


        // =====================================
        // VALIDAR USUARIO
        // =====================================

        if (!usuario) {

            return res.status(401).json({

                mensaje: 'Correo incorrecto'

            });

        }


        // =====================================
        // BLOQUEAR USUARIO VENTA FÍSICA
        // =====================================

        if (usuario.correo === 'ventas_fisico@tienda.com') {

            return res.status(403).json({
                mensaje: 'Este usuario no puede iniciar sesión'
            });

        }


        // =====================================
        // VALIDAR PASSWORD
        // =====================================

        const passwordCorrecta = await bcrypt.compare(

            contraseña,

            usuario.contraseña

        );


        if (!passwordCorrecta) {

            return res.status(401).json({

                mensaje: 'Contraseña incorrecta'

            });

        }


        // =====================================
        // GENERAR TOKEN
        // =====================================

        const token = jwt.sign(

            {
                id: usuario.id,
                rol: usuario.rol
            },

            process.env.JWT_SECRET,

            {
                expiresIn: '8h'
            }
        );


        // =====================================
        // RESPUESTA
        // =====================================

        res.json({

            mensaje: 'Login correcto',

            token

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            mensaje: 'Error interno del servidor'

        });

    }

};


/**
 * Cierra la sesión del usuario (invalida el token desde el cliente).
 * @returns {Object} Mensaje de confirmación.
 * Endpoint: POST /api/auth/logout
 */
const logout = async (req, res) => {

    try {

        res.json({

            mensaje: 'Logout correcto'

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            mensaje: 'Error interno del servidor'

        });

    }

};


/**
 * Envía un código de recuperación al correo del usuario.
 * @param {Object} req.body - { correo }
 * @returns {Object} Mensaje indicando que el código fue enviado.
 * Endpoint: POST /api/auth/enviar-codigo
 */
const enviarCodigoRecuperacion = async (req, res) => {

    try {

        const { correo } = req.body;


        // =====================================
        // BUSCAR USUARIO
        // =====================================

        const usuarioDB = await sql.query`

            SELECT
                id,
                correo

            FROM Usuarios

            WHERE correo = ${correo}
        `;


        if (usuarioDB.recordset.length === 0) {

            return res.status(404).json({

                mensaje: 'Usuario no encontrado'

            });

        }


        // =====================================
        // GENERAR CÓDIGO
        // =====================================

        const codigo = Math.floor(

            100000 + Math.random() * 900000

        ).toString();


        // =====================================
        // FECHA EXPIRACIÓN
        // =====================================

        const expiracion = new Date(

            Date.now() + 15 * 60 * 1000

        );


        // =====================================
        // GUARDAR EN DB
        // =====================================

        await sql.query`

            UPDATE Usuarios

            SET
                codigo_recuperacion = ${codigo},
                expiracion_codigo = ${expiracion}

            WHERE correo = ${correo}
        `;


        // =====================================
        // ENVIAR EMAIL
        // =====================================

        await transporter.sendMail({

            from: process.env.EMAIL_USER,

            to: correo,

            subject: 'Recuperación de contraseña',

            html: `

                <h1>Recuperación de contraseña</h1>

                <p>Tu código de recuperación es:</p>

                <h2>${codigo}</h2>

                <p>El código expira en 15 minutos.</p>

            `

        });


        // =====================================
        // RESPUESTA
        // =====================================

        res.json({

            mensaje: 'Código enviado al gmail proporcionado correctamente'

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            mensaje: 'Error interno del servidor'

        });

    }

};


/**
 * Verifica que el código de recuperación sea válido y no haya expirado.
 * @param {Object} req.body - { correo, codigo }
 * @returns {Object} Mensaje indicando si el código es válido.
 * Endpoint: POST /api/auth/verificar-codigo
 */
const verificarCodigo = async (req, res) => {

    try {

        const {
            correo,
            codigo
        } = req.body;


        // =====================================
        // BUSCAR USUARIO
        // =====================================

        const usuarioDB = await sql.query`

            SELECT
                codigo_recuperacion,
                expiracion_codigo

            FROM Usuarios

            WHERE correo = ${correo}
        `;


        if (usuarioDB.recordset.length === 0) {

            return res.status(404).json({

                mensaje: 'Usuario no encontrado'

            });

        }


        const usuario = usuarioDB.recordset[0];


        // =====================================
        // VALIDAR CÓDIGO
        // =====================================

        if (usuario.codigo_recuperacion !== codigo) {

            return res.status(400).json({

                mensaje: 'Código incorrecto'

            });

        }


        // =====================================
        // VALIDAR EXPIRACIÓN
        // =====================================

        const ahora = new Date();

        const expiracion = new Date(
            usuario.expiracion_codigo
        );


        if (ahora > expiracion) {

            return res.status(400).json({

                mensaje: 'Código expirado'

            });

        }


        // =====================================
        // RESPUESTA
        // =====================================

        res.json({

            mensaje: 'Código válido'

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            mensaje: 'Error interno del servidor'

        });

    }

};


// =====================================
// CAMBIAR PASSWORD
// =====================================

const nuevaPassword = async (req, res) => {

    try {

        const {
            correo,
            codigo,
            nuevaPassword
        } = req.body;


        // =====================================
        // BUSCAR USUARIO
        // =====================================

        const usuarioDB = await sql.query`

            SELECT
                codigo_recuperacion,
                expiracion_codigo

            FROM Usuarios

            WHERE correo = ${correo}
        `;


        if (usuarioDB.recordset.length === 0) {

            return res.status(404).json({

                mensaje: 'Usuario no encontrado'

            });

        }


        const usuario = usuarioDB.recordset[0];


        // =====================================
        // VALIDAR CÓDIGO
        // =====================================

        if (usuario.codigo_recuperacion !== codigo) {

            return res.status(400).json({

                mensaje: 'Código incorrecto'

            });

        }


        // =====================================
        // VALIDAR EXPIRACIÓN
        // =====================================

        const ahora = new Date();

        const expiracion = new Date(
            usuario.expiracion_codigo
        );


        if (ahora > expiracion) {

            return res.status(400).json({

                mensaje: 'Código expirado'

            });

        }


        // =====================================
        // ENCRIPTAR PASSWORD
        // =====================================

        const passwordHash = await bcrypt.hash(
            nuevaPassword,
            10
        );


        // =====================================
        // ACTUALIZAR PASSWORD
        // =====================================

        await sql.query`

            UPDATE Usuarios

            SET
                contraseña = ${passwordHash},
                codigo_recuperacion = NULL,
                expiracion_codigo = NULL

            WHERE correo = ${correo}
        `;


        // =====================================
        // RESPUESTA
        // =====================================

        res.json({

            mensaje: 'Contraseña actualizada correctamente'

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            mensaje: 'Error interno del servidor'

        });

    }

};


module.exports = {

    login,
    logout,

    enviarCodigoRecuperacion,
    verificarCodigo,
    nuevaPassword

};
