const express = require('express');

const router = express.Router();

const {
    obtenerProductos,
    crearProducto,
    actualizarProducto,
    eliminarProducto
} = require('../controllers/productos.controller');

const {
    verificarToken,
    verificarAdmin
} = require('../middlewares/auth.middleware');

// =====================================
// GET
// =====================================

router.get('/', obtenerProductos);


// =====================================
// POST
// =====================================

router.post(
    '/',
    verificarToken,
    verificarAdmin,
    crearProducto
);

// =====================================
// PUT
// =====================================

router.put(
    '/:id',
    verificarToken,
    verificarAdmin,
    actualizarProducto
);


// =====================================
// DELETE
// =====================================

router.delete(
    '/:id',
    verificarToken,
    verificarAdmin,
    eliminarProducto
);


module.exports = router;