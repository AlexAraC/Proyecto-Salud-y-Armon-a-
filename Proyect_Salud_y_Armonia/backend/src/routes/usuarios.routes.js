const express = require('express');

const router = express.Router();


const {
    obtenerUsuarios,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario,
    cambiarRol,
    banearUsuario,
    verificarAdministrador,
    verificarCorreo,
    obtenerMiPerfil
} = require('../controllers/usuarios.controller');

const {
    verificarToken,
    verificarAdmin,
    verificarUser
} = require('../middlewares/auth.middleware');
// =====================================
// GET
// =====================================

router.get('/', 
    verificarToken,
    verificarAdmin,
    obtenerUsuarios);


router.get(
    '/verificar-admin',
    verificarToken,
    verificarAdmin,
    verificarAdministrador
);

router.get(
    '/me',
    verificarToken,
    obtenerMiPerfil
);

// =====================================
// VERIFICAR CORREO
// =====================================

router.get(
    '/verificar/:token',
    verificarCorreo
);

// =====================================
// POST
// =====================================

router.post('/', crearUsuario);


// =====================================
// PUT
// =====================================

router.put('/:id', 
    verificarToken,
    verificarUser,
    actualizarUsuario);


router.put('/:id/rol',
    verificarToken,
    verificarAdmin,
    cambiarRol
);

router.put('/:id/ban',
    verificarToken,
    verificarAdmin,
    banearUsuario
);

// =====================================
// DELETE
// =====================================

router.delete('/:id', 
    verificarToken,
    verificarUser,
    eliminarUsuario
    
);


module.exports = router;