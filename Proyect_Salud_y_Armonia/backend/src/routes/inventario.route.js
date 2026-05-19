const express = require('express');

const router = express.Router();

const {//Aqui se piden las funciones del controlador de inventario
    actualizarStock,
    obtenerStocks
} = require('../controllers/inventario.controller');

const {
    verificarToken,
    verificarAdmin,
} = require('../middlewares/auth.middleware');

router.put(
    '/',
    verificarToken,
    verificarAdmin,
    actualizarStock
);

router.get(
    '/',
    verificarToken,
    verificarAdmin,
    obtenerStocks
);
module.exports = router;