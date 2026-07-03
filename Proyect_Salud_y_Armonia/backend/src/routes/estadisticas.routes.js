// Importación de Express para crear rutas
const express = require('express');

// Enrutador de Express
const router = express.Router();

// Controlador de estadísticas del sistema
const {
    obtenerEstadisticas
} = require('../controllers/estadisticas.controller');
// Middlewares de autenticación y autorización
const {
    verificarToken,
    verificarAdmin,
} = require('../middlewares/auth.middleware');

// =====================================
// OBTENER ESTADÍSTICAS (solo admin)
// =====================================

router.get(
    '/',
    verificarToken,
    verificarAdmin,
    obtenerEstadisticas
);

module.exports = router;