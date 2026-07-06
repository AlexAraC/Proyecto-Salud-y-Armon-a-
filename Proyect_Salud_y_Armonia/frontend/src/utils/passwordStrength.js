/**
 * Validador de fortaleza de contraseña.
 * Reglas aplicadas a contraseñas NUEVAS (registro y cambio de contraseña).
 * Las contraseñas existentes/activas no se ven afectadas.
 */

export const REGLAS = [
    {
        id: 'longitud',
        label: 'Mínimo 8 caracteres',
        test: (v) => v.length >= 8,
    },
    {
        id: 'mayuscula',
        label: 'Al menos una letra mayúscula (A-Z)',
        test: (v) => /[A-Z]/.test(v),
    },
    {
        id: 'minuscula',
        label: 'Al menos una letra minúscula (a-z)',
        test: (v) => /[a-z]/.test(v),
    },
    {
        id: 'numero',
        label: 'Al menos un número (0-9)',
        test: (v) => /[0-9]/.test(v),
    },
    {
        id: 'simbolo',
        label: 'Al menos un símbolo (!@#$%^&*...)',
        test: (v) => /[^A-Za-z0-9]/.test(v),
    },
];

/** Contraseñas comunes / triviales que se rechazan aunque pasen las reglas */
const BLOQUEADAS = new Set([
    'Password1!', 'Password1@', 'Passw0rd!', 'Abc12345!',
    'Qwerty123!', 'Admin123!', '12345678', 'Contraseña1!',
]);

/**
 * Evalúa una contraseña y devuelve:
 * - reglas: array con { id, label, cumple }
 * - nivel: 0 (vacío) | 1 (débil) | 2 (media) | 3 (fuerte) | 4 (muy fuerte)
 * - valida: true si pasa TODAS las reglas y no está bloqueada
 * - mensaje: string descriptivo del nivel
 */
export function evaluarPassword(valor) {
    if (!valor) {
        return {
            reglas: REGLAS.map((r) => ({ ...r, cumple: false })),
            nivel: 0,
            valida: false,
            mensaje: '',
        };
    }

    const reglas = REGLAS.map((r) => ({ ...r, cumple: r.test(valor) }));
    const cumplidas = reglas.filter((r) => r.cumple).length;

    let nivel;
    if (cumplidas <= 1) nivel = 1;
    else if (cumplidas === 2) nivel = 1;
    else if (cumplidas === 3) nivel = 2;
    else if (cumplidas === 4) nivel = 3;
    else nivel = 4;

    const todasCumplidas = cumplidas === REGLAS.length;
    const esBloqueada = BLOQUEADAS.has(valor);
    const valida = todasCumplidas && !esBloqueada;

    const MENSAJES = ['', 'Débil', 'Regular', 'Buena', 'Muy fuerte'];
    const mensaje = esBloqueada ? 'Contraseña demasiado común' : MENSAJES[nivel];

    return { reglas, nivel: esBloqueada ? 1 : nivel, valida, mensaje };
}

/**
 * Devuelve un mensaje de error listo para mostrar al usuario,
 * o null si la contraseña es válida.
 */
export function mensajeErrorPassword(valor) {
    const { valida, reglas, mensaje } = evaluarPassword(valor);
    if (valida) return null;
    if (!valor) return 'La contraseña es obligatoria';
    if (mensaje === 'Contraseña demasiado común') return mensaje;
    const fallidas = reglas.filter((r) => !r.cumple).map((r) => r.label);
    return `La contraseña no cumple: ${fallidas.join(', ')}`;
}
