const express = require('express');

const router = express.Router();


// =====================================
// CONTROLADOR
// =====================================

const {

    obtenerCarritoPorUsuario,
    agregarProductoAlCarrito,
    actualizarCantidadProductoEnCarrito,
    eliminarProductoDelCarrito,
    vaciarCarrito,
    convertirCarritoAPedido

} = require('../controllers/carrito.controller');


// =====================================
// MIDDLEWARES
// =====================================

const {

    verificarToken,
    verificarUser

} = require('../middlewares/auth.middleware');


// =====================================
// VER CARRITO
// =====================================

router.get(
    '/',
    verificarToken,
    verificarUser,
    obtenerCarritoPorUsuario
);


// =====================================
// AGREGAR PRODUCTO
// =====================================

router.post(
    '/',
    verificarToken,
    verificarUser,
    agregarProductoAlCarrito
);


// =====================================
// ACTUALIZAR CANTIDAD
// =====================================

router.put(
    '/',
    verificarToken,
    verificarUser,
    actualizarCantidadProductoEnCarrito
);


// =====================================
// VACIAR CARRITO
// =====================================

router.delete(
    '/vaciar',
    verificarToken,
    verificarUser,
    vaciarCarrito
);


// =====================================
// ELIMINAR PRODUCTO
// =====================================

router.delete(
    '/:producto_id',
    verificarToken,
    verificarUser,
    eliminarProductoDelCarrito
);


// =====================================
// CONVERTIR A PEDIDO
// =====================================

router.post(
    '/checkout',
    verificarToken,
    verificarUser,
    convertirCarritoAPedido
);


// =====================================
// EXPORTAR ROUTER
// =====================================

module.exports = router;