const express = require('express');

const router = express.Router();

const {
    obtenerUsuarios,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario
} = require('../controllers/usuarios.controller');


// =====================================
// GET
// =====================================

router.get('/', obtenerUsuarios);


// =====================================
// POST
// =====================================

router.post('/', crearUsuario);


// =====================================
// PUT
// =====================================

router.put('/:id', actualizarUsuario);


// =====================================
// DELETE
// =====================================

router.delete('/:id', eliminarUsuario);


module.exports = router;