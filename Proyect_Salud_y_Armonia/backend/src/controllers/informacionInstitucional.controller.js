const { sql } = require('../config/db');

// =====================================
// OBTENER INFORMACIÓN INSTITUCIONAL
// =====================================

const obtenerInformacionInstitucional = async (req, res) => {

    try {

        const informacion = await sql.query`

            SELECT
                id,
                slogan,
                mision,
                vision,
                telefono,
                correo,
                imagen

            FROM informacionInstitucional
        `;

        res.json({

            mensaje: 'Información institucional obtenida correctamente',

            informacion: informacion.recordset

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            mensaje: 'Error interno del servidor'

        });

    }

};


// =====================================
// CREAR INFORMACIÓN INSTITUCIONAL
// =====================================

const crearInformacionInstitucional = async (req, res) => {

    try {

        const {

            slogan,
            mision,
            vision,
            telefono,
            correo

        } = req.body;


        // =====================================
        // IMAGEN
        // =====================================

        const imagen = req.file

            ? `/uploads/${req.file.filename}`

            : null;


        // =====================================
        // INSERTAR
        // =====================================

        await sql.query`

            INSERT INTO informacionInstitucional
            (
                slogan,
                mision,
                vision,
                telefono,
                correo,
                imagen
            )

            VALUES
            (
                ${slogan},
                ${mision},
                ${vision},
                ${telefono},
                ${correo},
                ${imagen}
            )
        `;


        res.json({

            mensaje: 'Información institucional creada correctamente'

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            mensaje: 'Error interno del servidor'

        });

    }

};


// =====================================
// ACTUALIZAR INFORMACIÓN INSTITUCIONAL
// =====================================

const actualizarInformacionInstitucional = async (req, res) => {

    try {

        const { id } = req.params;

        const {

            slogan,
            mision,
            vision,
            telefono,
            correo

        } = req.body;


        // =====================================
        // INFORMACIÓN ACTUAL
        // =====================================

        const informacionActual = await sql.query`

            SELECT imagen

            FROM informacionInstitucional

            WHERE id = ${id}
        `;


        if (informacionActual.recordset.length === 0) {

            return res.status(404).json({

                mensaje: 'Información no encontrada'

            });

        }


        // =====================================
        // IMAGEN
        // =====================================

        let imagen =

            informacionActual.recordset[0].imagen;


        if (req.file) {

            imagen =

                `/uploads/${req.file.filename}`;

        }


        // =====================================
        // ACTUALIZAR
        // =====================================

        await sql.query`

            UPDATE informacionInstitucional

            SET

                slogan = ${slogan},

                mision = ${mision},

                vision = ${vision},

                telefono = ${telefono},

                correo = ${correo},

                imagen = ${imagen}

            WHERE id = ${id}
        `;


        res.json({

            mensaje: 'Información institucional actualizada correctamente'

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            mensaje: 'Error interno del servidor'

        });

    }

};


// =====================================
// ELIMINAR INFORMACIÓN INSTITUCIONAL
// =====================================

const eliminarInformacionInstitucional = async (req, res) => {

    try {

        const { id } = req.params;


        const informacionDB = await sql.query`

            SELECT id

            FROM informacionInstitucional

            WHERE id = ${id}
        `;


        if (informacionDB.recordset.length === 0) {

            return res.status(404).json({

                mensaje: 'Información no encontrada'

            });

        }


        await sql.query`

            DELETE FROM informacionInstitucional

            WHERE id = ${id}
        `;


        res.json({

            mensaje: 'Información institucional eliminada correctamente'

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            mensaje: 'Error interno del servidor'

        });

    }

};


module.exports = {

    obtenerInformacionInstitucional,
    crearInformacionInstitucional,
    actualizarInformacionInstitucional,
    eliminarInformacionInstitucional

};
