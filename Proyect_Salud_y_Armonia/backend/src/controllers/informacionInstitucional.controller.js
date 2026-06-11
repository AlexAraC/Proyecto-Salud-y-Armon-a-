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
                descripcion,
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

        console.log(error);

        res.status(500).json({

            mensaje: error.message

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
            descripcion,
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
                descripcion,
                telefono,
                correo,
                imagen
            )

            VALUES
            (
                ${slogan},
                ${descripcion},
                ${telefono},
                ${correo},
                ${imagen}
            )
        `;


        res.json({

            mensaje: 'Información institucional creada correctamente'

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            mensaje: error.message

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
            descripcion,
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

                descripcion = ${descripcion},

                telefono = ${telefono},

                correo = ${correo},

                imagen = ${imagen}

            WHERE id = ${id}
        `;


        res.json({

            mensaje: 'Información institucional actualizada correctamente'

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            mensaje: error.message

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

        console.log(error);

        res.status(500).json({

            mensaje: error.message

        });

    }

};


module.exports = {

    obtenerInformacionInstitucional,
    crearInformacionInstitucional,
    actualizarInformacionInstitucional,
    eliminarInformacionInstitucional

};