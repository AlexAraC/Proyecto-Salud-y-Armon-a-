const { sql } = require('../config/db');


// =====================================
// OBTENER COMENTARIOS
// =====================================
const obtenerComentarios = async (req, res, next) => {

    try {

        const comentarios = await sql.query`

            SELECT
                c.id,
                c.tipo,
                c.contenido,
                c.fecha,
                c.usuario_id,
                u.nombre AS usuario_nombre

            FROM Comentario c
            LEFT JOIN Usuarios u ON c.usuario_id = u.id
        `;

        res.json({

            mensaje: 'Comentarios obtenidos correctamente',

            comentarios: comentarios.recordset

        });

    } catch (error) {

        next(error);

    }

};

// =====================================
// Crear comentario
// =====================================

const crearComentario = async (req, res, next) => {

    try {

        const { tipo, contenido } = req.body;
        const tiposValidos = ['comentario', 'reporte']

        const usuarioDB = await sql.query`

            SELECT baneado, motivo_ban

            FROM Usuarios

            WHERE id = ${req.usuario.id}
        `;

        if (usuarioDB.recordset.length > 0 && usuarioDB.recordset[0].baneado) {

            return res.status(403).json({
                mensaje: `No puedes enviar comentarios. Tu cuenta ha sido suspendida. Motivo: ${usuarioDB.recordset[0].motivo_ban || 'No especificado'}`
            });

        }


        if (!tiposValidos.includes(tipo)) {

        return res.status(400).json({
            mensaje: 'Tipo no válido'
        });

        }


        await sql.query`

            INSERT INTO Comentario (tipo, contenido, fecha, usuario_id)

            VALUES (${tipo}, ${contenido}, GETDATE(), ${req.usuario.id})

        `;

        res.status(201).json({

            message: 'Comentario creado correctamente'

        });

    } catch (error) {

        next(error);

    }
}

const eliminarComentario = async (req, res, next) => {

    try {

        const { id } = req.params;


        // =====================================
        // VALIDAR EXISTENCIA
        // =====================================

        const comentarioDB = await sql.query`

            SELECT
                id

            FROM Comentario

            WHERE id = ${id}
        `;


        if (comentarioDB.recordset.length === 0) {

            return res.status(404).json({
                mensaje: 'Comentario no encontrado'
            });

        }


        // =====================================
        // ELIMINAR COMENTARIO
        // =====================================

        await sql.query`

            DELETE FROM Comentario

            WHERE id = ${id}
        `;



        res.json({

            mensaje: 'Comentario eliminado correctamente'

        });


    } catch (error) {

        next(error);

    }

};

// =====================================
// SEPARAR COMENTARIOS POR TIPO
// =====================================

const separarComentariosPorTipo = async (req, res, next) => {

    try {

        const comentarios = await sql.query`

            SELECT
                c.id,
                c.tipo,
                c.contenido,
                c.fecha,
                c.usuario_id,
                u.nombre AS usuario_nombre

            FROM Comentario c
            LEFT JOIN Usuarios u ON c.usuario_id = u.id

            WHERE c.tipo = 'comentario'

            ORDER BY c.fecha DESC
        `;

        const reportes = await sql.query`

            SELECT
                c.id,
                c.tipo,
                c.contenido,
                c.fecha,
                c.usuario_id,
                u.nombre AS usuario_nombre

            FROM Comentario c
            LEFT JOIN Usuarios u ON c.usuario_id = u.id

            WHERE c.tipo = 'reporte'

            ORDER BY c.fecha DESC
        `;

        res.json({

            mensaje: 'Comentarios obtenidos correctamente',

            comentarios: comentarios.recordset,

            reportes: reportes.recordset

        });

    } catch (error) {

        next(error);

    }

};


module.exports = {
    obtenerComentarios,
    crearComentario,
    eliminarComentario,
    separarComentariosPorTipo
};