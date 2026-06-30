const express = require('express');

const router = express.Router();


// =====================================
// CONTROLADOR
// =====================================

const {
    registrarVenta
} = require('../controllers/ventas.controller');


// =====================================
// MIDDLEWARES
// =====================================

const {
    verificarToken,
    verificarAdmin
} = require('../middlewares/auth.middleware');


// =====================================
// REGISTRAR VENTA FÍSICA
// =====================================

router.post(
    '/',
    verificarToken,
    verificarAdmin,
    registrarVenta
);


module.exports = router;
