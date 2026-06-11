const express = require('express');

const router = express.Router();

const {
    crearPedido,
    actualizarEstadoPedido,
    verPedidosAdmin,
    verPedidosCliente,
    cancelarPedido,
    obtenerEstadisticasPedidos,
    obtenerPedidoPorId,
    obtenerPedidosPorUsuario
} = require('../controllers/pedido.controller');

const {
    verificarToken,
    verificarAdmin,
    verificarUser
} = require('../middlewares/auth.middleware');

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
    '/:id/cancelar',
    verificarToken,
    verificarUser,
    cancelarPedido
);

router.get(
    '/Estadisticas',
    verificarToken,
    verificarAdmin,
    obtenerEstadisticasPedidos
);

router.get(
    '/usuario/:id',
    verificarToken,
    verificarAdmin,
    obtenerPedidosPorUsuario
);

router.get(
    '/:id',
    verificarToken,
    obtenerPedidoPorId
);

module.exports = router;