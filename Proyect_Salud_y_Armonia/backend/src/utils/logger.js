const fs = require('fs');
const path = require('path');

// =====================================
// LOGGER SEGURO
// =====================================
// Solo imprime el mensaje del error en consola
// y guarda el stack completo en un archivo
// para evitar exponer datos sensibles
// (passwords, SQL, rutas internas, JWT, etc.)
// =====================================

const LOG_DIR = path.join(__dirname, '../../logs');

// Asegurar que el directorio de logs existe
if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
}

const logError = (error, contexto = '') => {

    const mensaje = error?.message || error || 'Error desconocido';
    const stack   = error?.stack   || '';

    // Solo el mensaje en consola (seguro)
    if (contexto) {
        console.error(`[${contexto}] ${mensaje}`);
    } else {
        console.error(mensaje);
    }

    // Stack completo al archivo de logs
    const timestamp = new Date().toISOString();
    const logLine = `
[${timestamp}]${contexto ? ` [${contexto}]` : ''}
  Mensaje: ${mensaje}
  Stack: ${stack}
  ----------------------------------------
`;

    const fecha = new Date();
    const logFile = path.join(
        LOG_DIR,
        `error-${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')}.log`
    );

    fs.appendFile(logFile, logLine, (err) => {
        if (err) {
            console.error('Error al escribir en el archivo de logs');
        }
    });

};

module.exports = { logError };