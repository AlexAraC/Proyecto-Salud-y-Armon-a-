/**
 * Seed de administrador por defecto.
 * Se ejecuta una sola vez al arrancar el servidor.
 * Si ya existe al menos un usuario con rol 'admin' en la DB, no hace nada.
 */

const bcrypt = require('bcrypt');
const { sql } = require('./db');

const ADMIN_DEFAULT = {
    nombre:    'Graciela',
    correo:    'grassolhr@gmail.com',
    password:  'Ws2x5sf5yh',
    rol:       'admin',
    telefono:  '8949-8822',
    direccion: ' San Carlos, Alajuela, Costa Rica',
};

const seedAdmin = async () => {

    try {

        // ── ¿Ya existe algún admin? ──────────────────────────────────────
        const resultado = await sql.query`
            SELECT COUNT(*) AS total
            FROM Usuarios
            WHERE rol = 'admin'
        `;

        const totalAdmins = resultado.recordset[0].total;

        if (totalAdmins > 0) {
            // Ya hay al menos un admin, no se hace nada
            return;
        }

        // ── Hashear contraseña ───────────────────────────────────────────
        const passwordHash = await bcrypt.hash(ADMIN_DEFAULT.password, 10);

        // ── Insertar admin por defecto ───────────────────────────────────
        await sql.query`
            INSERT INTO Usuarios
            (
                nombre,
                correo,
                contraseña,
                rol,
                telefono,
                direccion,
                verificado
            )
            VALUES
            (
                ${ADMIN_DEFAULT.nombre},
                ${ADMIN_DEFAULT.correo},
                ${passwordHash},
                ${ADMIN_DEFAULT.rol},
                ${ADMIN_DEFAULT.telefono},
                ${ADMIN_DEFAULT.direccion},
                1
            )
        `;

        console.log('Admin por defecto creado: admin@correo.com');

    } catch (error) {

        console.error('Error creando admin por defecto:', error.message);

    }

};

module.exports = { seedAdmin };
