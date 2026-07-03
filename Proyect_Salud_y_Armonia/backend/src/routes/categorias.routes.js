// Importación de Express para crear rutas
const express = require('express');

// Enrutador de Express
const router = express.Router();

// Controladores de categorías
const {
    verCategorias,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria
} = require('../controllers/categorias.controller');

// Middlewares de autenticación y autorización
const {
    verificarToken,
    verificarAdmin
} = require('../middlewares/auth.middleware');


// =====================================
// GET
// =====================================

router.get('/', verCategorias);


// =====================================
// POST
// =====================================

router.post(
    '/',
    verificarToken,
    verificarAdmin,
    crearCategoria
);


// =====================================
// PUT
// =====================================

router.put(
    '/:id',
    verificarToken,
    verificarAdmin,
    actualizarCategoria
);


// =====================================
// DELETE
// =====================================

router.delete(
    '/:id',
    verificarToken,
    verificarAdmin,
    eliminarCategoria
);


module.exports = router;