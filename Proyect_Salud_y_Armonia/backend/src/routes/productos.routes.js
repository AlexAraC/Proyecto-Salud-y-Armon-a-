const express = require('express');

const router = express.Router();

const upload = require('../middlewares/upload');

const {

    crearProducto,
    obtenerProductos,
    obtenerProductoPorId,
    actualizarProducto,
    eliminarProducto

} = require('../controllers/productos.controller');

const {
    verificarAdmin,
    verificarToken

} = require('../middlewares/auth.middleware')

// =====================================
// OBTENER TODOS
// =====================================

router.get(
    '/',
    obtenerProductos
);


// =====================================
// OBTENER POR ID
// =====================================

router.get(
    '/:id',
    obtenerProductoPorId
);


// =====================================
// CREAR PRODUCTO
// =====================================

router.post(

    '/',

    verificarAdmin,

    verificarToken,


    upload.single('imagen'),

    crearProducto

);


// =====================================
// ACTUALIZAR PRODUCTO
// =====================================

router.put(

    '/:id',

    verificarAdmin,

    verificarToken,


    upload.single('imagen'),

    actualizarProducto

);


// =====================================
// ELIMINAR PRODUCTO
// =====================================

router.delete(
    '/:id',
    
    verificarAdmin,

    verificarToken,

    eliminarProducto
);


module.exports = router;