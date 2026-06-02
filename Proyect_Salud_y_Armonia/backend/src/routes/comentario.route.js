const express = require('express');

const router = express.Router();

const {
    obtenerComentarios,
    crearComentario,
    eliminarComentario,
    separarComentariosPorTipo
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

//=====================================
// SEPARAR COMENTARIOS POR TIPO
//=====================================
router.get('/comunicacion_cliente', separarComentariosPorTipo)

module.exports = router;