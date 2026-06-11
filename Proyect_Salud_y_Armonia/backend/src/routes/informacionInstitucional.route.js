const express = require('express');

const upload =
    require('../middlewares/upload');

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
    upload.single('imagen'),
    crearInformacionInstitucional
);


// =====================================
// ACTUALIZAR INFORMACIÓN INSTITUCIONAL
// =====================================

router.put(
    '/:id',
    verificarToken,
    verificarAdmin,
    upload.single('imagen'),
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