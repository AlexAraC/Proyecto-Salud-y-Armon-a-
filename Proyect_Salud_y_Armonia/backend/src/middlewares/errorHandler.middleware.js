const { logError } = require('../utils/logger');


// =====================================
// ERROR HANDLER GLOBAL
// =====================================
// Express ejecuta este middleware automáticamente
// cuando un controlador llama a next(err).
// =====================================

const errorHandler = (err, req, res, next) => {

    // Guardar stack en archivo de logs + imprimir mensaje en consola
    logError(err, 'GLOBAL_HANDLER');

    const status = err.status || 500;

    res.status(status).json({
        ok: false,
        mensaje: err.message || 'Error interno del servidor'
    });

};


module.exports = { errorHandler };