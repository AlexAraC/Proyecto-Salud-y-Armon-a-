const express = require('express');

const router = express.Router();

const {

    obtenerProductos,
    crearProducto,
    actualizarProducto,
    eliminarProducto,

    marcarProductoDestacado,
    desmarcarProductoDestacado,
    obtenerProductosMarcados,
    

} = require('../controllers/productos.controller');

const {

    verificarToken,
    verificarAdmin

} = require('../middlewares/auth.middleware');


// =====================================
// OBTENER TODOS LOS PRODUCTOS
// =====================================

router.get(
    '/',
    obtenerProductos
);


// =====================================
// OBTENER PRODUCTOS DESTACADOS
// =====================================

router.get(
    '/destacados',
    obtenerProductosMarcados
);


// =====================================
// CREAR PRODUCTO
// =====================================

router.post(
    '/',
    verificarToken,
    verificarAdmin,
    crearProducto
);


// =====================================
// MARCAR PRODUCTO COMO DESTACADO
// =====================================

router.put(
    '/:id/destacar',
    verificarToken,
    verificarAdmin,
    marcarProductoDestacado
);


// =====================================
// QUITAR PRODUCTO DESTACADO
// =====================================

router.put(
    '/:id/quitar-destacado',
    verificarToken,
    verificarAdmin,
    desmarcarProductoDestacado
);


// =====================================
// ACTUALIZAR PRODUCTO
// =====================================

router.put(
    '/:id',
    verificarToken,
    verificarAdmin,
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