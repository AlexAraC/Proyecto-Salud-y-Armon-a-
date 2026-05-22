const express = require('express');

const router = express.Router();

const {
    obtenerComentarios,
    crearComentario,
    eliminarComentario
} = require('../controllers/comentario.controller');
const e = require('express');

// =====================================
// OBTENER COMENTARIOS
// =====================================
router.get('/', obtenerComentarios);

// ===================================== 
// BORRAR COMENTARIOS
// =====================================

router.delete('/:id', eliminarComentario)

//======================================
// CREAR COMENTARIO
//======================================

router.post('/', crearComentario)

module.exports = router;