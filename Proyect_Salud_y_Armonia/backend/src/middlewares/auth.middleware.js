const jwt = require('jsonwebtoken');


// =====================================
// VERIFICAR TOKEN
// =====================================

const verificarToken = (req, res, next) => {

    try {

        // =====================================
        // OBTENER HEADER
        // =====================================

        const authHeader = req.headers.authorization;

        // =====================================
        // VALIDAR HEADER
        // =====================================

        if (!authHeader) {

            return res.status(401).json({
                mensaje: 'Token requerido'
            });

        }

        // =====================================
        // EXTRAER TOKEN
        // =====================================

        const token = authHeader.split(' ')[1];

        // =====================================
        // VERIFICAR TOKEN
        // =====================================

        const decoded = jwt.verify(
            token,
            'secreto_jwt'
        );

        // =====================================
        // GUARDAR USUARIO
        // =====================================

        req.usuario = decoded;

        next();

    } catch (error) {

        return res.status(401).json({
            mensaje: 'Token inválido'
        });

    }

};


// =====================================
// VERIFICAR ADMIN
// =====================================

const verificarAdmin = (req, res, next) => {

    if (req.usuario.rol !== 'admin') {

        return res.status(403).json({
            mensaje: 'Acceso denegado'
        });

    }

    next();

};


module.exports = {
    verificarToken,
    verificarAdmin
};