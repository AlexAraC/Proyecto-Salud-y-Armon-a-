const express = require('express');

const router = express.Router();

const {
    obtenerComentarios,
    crearComentario,
    eliminarComentario,
    separarComentariosPorTipo
} = require('../controllers/comentario.controller');
const {
    verificarToken,
    verificarAdmin
} = require('../middlewares/auth.middleware');

// =====================================
// OBTENER COMENTARIOS
// =====================================
router.get('/', obtenerComentarios);

// ===================================== 
// BORRAR COMENTARIOS
// =====================================

router.delete('/:id', verificarToken, verificarAdmin, eliminarComentario)

//======================================
// CREAR COMENTARIO
//======================================

router.post('/', verificarToken, crearComentario)

//=====================================
// SEPARAR COMENTARIOS POR TIPO
//=====================================
router.get('/comunicacion_cliente', separarComentariosPorTipo)

module.exports = router;