const express = require('express');

const router = express.Router();

const {
    obtenerEstadisticas
} = require('../controllers/estadisticas.controller');
const {
    verificarToken,
    verificarAdmin,
} = require('../middlewares/auth.middleware');
router.get(
    '/',
    verificarToken,
    verificarAdmin,
    obtenerEstadisticas
);

module.exports = router;