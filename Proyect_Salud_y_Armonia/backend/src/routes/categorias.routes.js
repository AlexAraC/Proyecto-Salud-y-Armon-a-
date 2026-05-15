const express = require('express');

const router = express.Router();

const {
    verCategorias,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria
} = require('../controllers/categorias.controller');

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