const multer = require('multer');

const path = require('path');


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

            path.extname(file.originalname);

        cb(null, nombreUnico);

    }

});


// =====================================
// MULTER
// =====================================

const upload = multer({

    storage

});

module.exports = upload;