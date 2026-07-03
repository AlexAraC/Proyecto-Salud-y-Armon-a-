// Importación de Express para crear rutas
const express = require('express');

// Enrutador de Express
const router = express.Router();

// Controladores de comentarios
const {
    obtenerComentarios,
    crearComentario,
    eliminarComentario,
    separarComentariosPorTipo
} = require('../controllers/comentario.controller');
// Middlewares de autenticación y autorización
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