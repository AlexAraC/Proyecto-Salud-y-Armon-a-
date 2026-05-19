const express = require('express');

const router = express.Router();


// =====================================
// CONTROLADOR
// =====================================

const {

    obtenerInformacionInstitucional,
    crearInformacionInstitucional,
    actualizarInformacionInstitucional,
    eliminarInformacionInstitucional

} = require('../controllers/informacionInstitucional.controller');


// =====================================
// MIDDLEWARES
// =====================================

const {

    verificarToken,
    verificarAdmin

} = require('../middlewares/auth.middleware');


// =====================================
// OBTENER INFORMACIÓN INSTITUCIONAL
// =====================================

router.get(
    '/',
    obtenerInformacionInstitucional
);


// =====================================
// CREAR INFORMACIÓN INSTITUCIONAL
// =====================================

router.post(
    '/',
    verificarToken,
    verificarAdmin,
    crearInformacionInstitucional
);


// =====================================
// ACTUALIZAR INFORMACIÓN INSTITUCIONAL
// =====================================

router.put(
    '/:id',
    verificarToken,
    verificarAdmin,
    actualizarInformacionInstitucional
);


// =====================================
// ELIMINAR INFORMACIÓN INSTITUCIONAL
// =====================================

router.delete(
    '/:id',
    verificarToken,
    verificarAdmin,
    eliminarInformacionInstitucional
);


// =====================================
// EXPORTAR ROUTER
// =====================================

module.exports = router;