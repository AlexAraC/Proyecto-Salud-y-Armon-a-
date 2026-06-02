const express = require('express');

const router = express.Router();

const {
    obtenerEstadisticas
} = require('../controllers/estadisticas.controller');

router.get(
    '/',
    obtenerEstadisticas
);

module.exports = router;