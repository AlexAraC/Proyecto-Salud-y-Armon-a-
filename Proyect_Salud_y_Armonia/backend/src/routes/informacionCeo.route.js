const express = require('express');

const router = express.Router();


// =====================================
// CONTROLADOR
// =====================================

const {

    obtenerInformacionCeo,
    crearInformacionCeo,
    actualizarInformacionCeo,
    eliminarInformacionCeo

} = require('../controllers/informacionCeo.controller');


// =====================================
// MIDDLEWARES
// =====================================

const {

    verificarToken,
    verificarAdmin

} = require('../middlewares/auth.middleware');


// =====================================
// OBTENER INFORMACIÓN CEO
// =====================================

router.get(
    '/',
    obtenerInformacionCeo
);


// =====================================
// CREAR INFORMACIÓN CEO
// =====================================

router.post(
    '/',
    verificarToken,
    verificarAdmin,
    crearInformacionCeo
);


// =====================================
// ACTUALIZAR INFORMACIÓN CEO
// =====================================

router.put(
    '/:id',
    verificarToken,
    verificarAdmin,
    actualizarInformacionCeo
);


// =====================================
// ELIMINAR INFORMACIÓN CEO
// =====================================

router.delete(
    '/:id',
    verificarToken,
    verificarAdmin,
    eliminarInformacionCeo
);


// =====================================
// EXPORTAR ROUTER
// =====================================

module.exports = router;