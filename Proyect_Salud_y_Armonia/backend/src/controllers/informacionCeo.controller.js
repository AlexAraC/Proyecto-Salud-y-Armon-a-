const { sql } = require('../config/db');


// =====================================
// OBTENER INFORMACIÓN CEO
// =====================================

const obtenerInformacionCeo = async (req, res) => {

    try {

        const informacion = await sql.query`

            SELECT

                id,
                nombre,
                correo,
                telefono,
                imagen,
                slogan

            FROM informacionCeo
        `;

        res.json({

            mensaje: 'Información obtenida correctamente',

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
// CREAR INFORMACIÓN CEO
// =====================================

const crearInformacionCeo = async (req, res) => {

    try {

        const {

            nombre,
            correo,
            telefono,
            slogan

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

            INSERT INTO informacionCeo
            (
                nombre,
                correo,
                telefono,
                imagen,
                slogan
            )

            VALUES
            (
                ${nombre},
                ${correo},
                ${telefono},
                ${imagen},
                ${slogan}
            )
        `;


        res.json({

            mensaje: 'Información creada correctamente'

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            mensaje: error.message

        });

    }

};


// =====================================
// ACTUALIZAR INFORMACIÓN CEO
// =====================================

const actualizarInformacionCeo = async (req, res) => {

    try {

        const { id } = req.params;

        const {

            nombre,
            correo,
            telefono,
            slogan

        } = req.body;


        // =====================================
        // INFORMACIÓN ACTUAL
        // =====================================

        const informacionActual = await sql.query`

            SELECT imagen

            FROM informacionCeo

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

            UPDATE informacionCeo

            SET

                nombre = ${nombre},

                correo = ${correo},

                telefono = ${telefono},

                imagen = ${imagen},

                slogan = ${slogan}

            WHERE id = ${id}
        `;


        res.json({

            mensaje: 'Información actualizada correctamente'

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            mensaje: error.message

        });

    }

};


// =====================================
// ELIMINAR INFORMACIÓN CEO
// =====================================

const eliminarInformacionCeo = async (req, res) => {

    try {

        const { id } = req.params;


        const informacionDB = await sql.query`

            SELECT id

            FROM informacionCeo

            WHERE id = ${id}
        `;


        if (informacionDB.recordset.length === 0) {

            return res.status(404).json({

                mensaje: 'Información no encontrada'

            });

        }


        await sql.query`

            DELETE FROM informacionCeo

            WHERE id = ${id}
        `;


        res.json({

            mensaje: 'Información eliminada correctamente'

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            mensaje: error.message

        });

    }

};


module.exports = {

    obtenerInformacionCeo,
    crearInformacionCeo,
    actualizarInformacionCeo,
    eliminarInformacionCeo

};