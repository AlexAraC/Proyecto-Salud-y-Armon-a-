const express = require('express');

const router = express.Router();

const {
    obtenerUsuarios,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario,
    cambiarRol
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

// =====================================
// DELETE
// =====================================

router.delete('/:id', 
    verificarToken,
    verificarUser,
    eliminarUsuario,
    cambiarRol
);


module.exports = router;