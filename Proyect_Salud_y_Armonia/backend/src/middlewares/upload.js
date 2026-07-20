const multer = require('multer');
const path = require('path');
require('dotenv').config();
app.use(helmet());
// =====================================
// CONFIG STORAGE
// =====================================

const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        cb(null, 'uploads/');

    },

    filename: (req, file, cb) => {

        const nombreUnico =
            Date.now() +
            path.extname(file.originalname).toLowerCase();

        cb(null, nombreUnico);

    }

});

// =====================================
// FILTRO DE ARCHIVOS
// =====================================

const fileFilter = (req, file, cb) => {

    // Extensiones permitidas
    const extensionesPermitidas = [
        '.jpg',
        '.jpeg',
        '.png',
        '.webp'
    ];

    // MIME Types permitidos
    const mimePermitidos = [
        'image/jpeg',
        'image/png',
        'image/webp'
    ];

    const extension = path.extname(file.originalname).toLowerCase();

    if (
        !extensionesPermitidas.includes(extension) ||
        !mimePermitidos.includes(file.mimetype)
    ) {

        return cb(
            new Error('Solo se permiten imágenes JPG, JPEG, PNG y WEBP.'),
            false
        );

    }

    cb(null, true);

};

// =====================================
// MULTER
// =====================================

const upload = multer({

    storage,

    fileFilter,

    limits: {

        // Tamaño máximo: 5 MB
        fileSize: 5 * 1024 * 1024

    }

});

module.exports = upload;