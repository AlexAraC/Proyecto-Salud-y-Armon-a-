const express = require('express');

const router = express.Router();

const {

    login,
    logout,

    enviarCodigoRecuperacion,
    verificarCodigo,
    nuevaPassword

} = require('../controllers/auth.controller');


// =====================================
// LOGIN
// =====================================

router.post(
    '/login',
    login
);


// =====================================
// LOGOUT
// =====================================

router.post(
    '/logout',
    logout
);


// =====================================
// ENVIAR CÓDIGO RECUPERACIÓN
// =====================================

router.post(
    '/recuperar-password',
    enviarCodigoRecuperacion
);


// =====================================
// VERIFICAR CÓDIGO
// =====================================

router.post(
    '/verificar-codigo',
    verificarCodigo
);


// =====================================
// NUEVA PASSWORD
// =====================================

router.post(
    '/nueva-password',
    nuevaPassword
);


module.exports = router;