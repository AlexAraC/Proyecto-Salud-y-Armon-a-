const { sql } = require('../config/db'); // Pedimos la conexión a la base de datos


// =====================================
// OBTENER COMENTARIOS
// =====================================
const obtenerComentarios = async (req, res) => {

    try {

        const comentarios = await sql.query`

            SELECT
                id,
                tipo,
                contenido,
                fecha

            FROM Comentarios
        `;

        res.json({

            mensaje: 'Comentarios obtenidos correctamente',

            comentarios: comentarios.recordset

        });

    } catch (error) {

        console.error('Error al obtener comentarios:', error);

        res.status(500).json({
            error: 'Error al obtener comentarios'
        });

    }

};

// =====================================
// Crear comentario
// =====================================

const crearComentario = async (req, res) => {

    try {

        const { tipo, contenido } = req.body;
        const tiposValidos = ['Comentario', 'Reporte']

        if (!tiposValidos.includes(tipo)) {

        return res.status(400).json({
            mensaje: 'Tipo no válido'
        });

        }


        await sql.query`

            INSERT INTO Comentarios (tipo, contenido, fecha)

            VALUES (${tipo}, ${contenido}, GETDATE())

        `;

        res.status(201).json({

            message: 'Comentario creado correctamente'

        });

    } catch (error) {

        console.error('Error al crear comentario:', error);

        res.status(500).json({

            error: 'Error al crear comentario'

        });
    }
}

const eliminarComentario = async (req, res) => {

    try {

        const { id } = req.params;


        // =====================================
        // VALIDAR EXISTENCIA
        // =====================================

        const comentarioDB = await sql.query`

            SELECT
                id

            FROM Comentarios

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

            DELETE FROM Comentarios

            WHERE id = ${id}
        `;



        res.json({

            mensaje: 'Comentario eliminado correctamente'

        });


    } catch (error) {

        console.error('Error al eliminar comentario:', error);

        res.status(500).json({

            error: 'Error al eliminar comentario'

        });

    }

};

module.exports = {
    obtenerComentarios,
    crearComentario,
    eliminarComentario
};
