const express = require('express');

const router = express.Router();

const {//Aqui se piden las funciones del controlador de pedidos
    crearPedido,
    actualizarEstadoPedido,
    verPedidosAdmin,
    verPedidosCliente,
} = require('../controllers/pedido.controller');

const {
    verificarToken,
    verificarAdmin,
    verificarUser
} = require('../middlewares/auth.middleware');


// =====================================
// CREAR PEDIDO
// =====================================

router.post(
    '/',
    verificarToken,
    verificarUser,
    crearPedido
);

router.put(
    '/:id',
    verificarToken,
    verificarAdmin,
    actualizarEstadoPedido
);

router.get(
    '/admin',
    verificarToken,
    verificarAdmin,
    verPedidosAdmin
);  
router.get(
    '/cliente',
    verificarToken,
    verificarUser,
    verPedidosCliente
);   
router.put(
    '/:id',
    verificarToken,
    verificarAdmin,
);
module.exports = router;