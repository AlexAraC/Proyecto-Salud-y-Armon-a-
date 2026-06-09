const express = require('express');

const router = express.Router();

const upload = require('../middlewares/upload');

const {

    crearProducto,
    obtenerProductos,
    obtenerProductoPorId,
    actualizarProducto,
    eliminarProducto,
    obtenerProductosDestacados,
    agregarDestacado,
    quitarDestacado

} = require('../controllers/productos.controller');

const {
    
    verificarToken,
    verificarAdmin

} = require('../middlewares/auth.middleware')

// =====================================
// OBTENER TODOS
// =====================================

router.get(
    '/',
    obtenerProductos
);

router.get(
    '/destacados',
    obtenerProductosDestacados
);


// =====================================
// OBTENER POR ID
// =====================================

router.get(
    '/:id',
    obtenerProductoPorId
);

// =====================================
// AGREGAR A DESTACADOS
// =====================================

router.put(

    '/destacados/:id',

    verificarToken,

    verificarAdmin,

    agregarDestacado

);


// =====================================
// QUITAR DE DESTACADOS
// =====================================

router.delete(

    '/destacados/:id',

    verificarToken,

    verificarAdmin,

    quitarDestacado

);

// =====================================
// CREAR PRODUCTO
// =====================================

router.post(

    '/',

    verificarToken,

    verificarAdmin,


    upload.single('imagen'),

    crearProducto

);


// =====================================
// ACTUALIZAR PRODUCTO
// =====================================

router.put(

    '/:id',

    verificarToken,
    
    verificarAdmin,


    upload.single('imagen'),

    actualizarProducto

);


// =====================================
// ELIMINAR PRODUCTO
// =====================================

router.delete(
    '/:id',
    
    verificarToken,

    verificarAdmin,

    eliminarProducto
);


module.exports = router;