const { sql } = require('../config/db');

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');


// =====================================
// LOGIN
// =====================================

const login = async (req, res) => {

    try {

        const {
            correo,
            contraseña
        } = req.body;

        // =====================================
        // BUSCAR USUARIO
        // =====================================

        const resultado = await sql.query(`
            SELECT * FROM Usuarios

            WHERE correo = '${correo}'
        `);

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

            'secreto_jwt',

            {
                expiresIn: '2h'
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

        console.log(error);

        res.status(500).json({
            mensaje: 'Error en login'
        });

    }

};
const logout = async (req, res) => {
    try {
        res.json({
            mensaje: 'Logout correcto'
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            mensaje: 'Error en logout'
        });
    }
}


module.exports = {
    login,
    logout
};