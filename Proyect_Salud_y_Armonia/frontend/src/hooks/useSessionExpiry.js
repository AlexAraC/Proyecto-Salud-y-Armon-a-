import { useState, useEffect, useCallback } from 'react';

const SESSION_DURATION_MS = 2 * 60 * 60 * 1000; // 2 horas
const CHECK_INTERVAL_MS  = 30 * 1000;            // revisar cada 30 segundos
const WARN_BEFORE_MS     = 60 * 1000;            // avisar 1 minuto antes

/**
 * Detecta si la sesión del usuario ha expirado (2 horas desde loginTime).
 * Devuelve:
 *   - expired   : true cuando ya caducó → el consumidor debe cerrar sesión
 *   - warning   : true durante el último minuto → mostrar aviso
 *   - remaining : segundos restantes (útil para el countdown)
 *   - dismiss   : función para que el usuario extienda la sesión (renueva loginTime)
 */
export function useSessionExpiry() {
    const [expired, setExpired]   = useState(false);
    const [warning, setWarning]   = useState(false);
    const [remaining, setRemaining] = useState(null);

    // Permite al usuario renovar su sesión manualmente desde el aviso
    const dismiss = useCallback(() => {
        localStorage.setItem('loginTime', Date.now().toString());
        setWarning(false);
        setExpired(false);
        setRemaining(null);
    }, []);

    useEffect(() => {
        const check = () => {
            const token     = localStorage.getItem('token');
            const loginTime = localStorage.getItem('loginTime');

            // Sin sesión activa, no hay nada que vigilar
            if (!token || !loginTime) {
                setWarning(false);
                setExpired(false);
                return;
            }

            const elapsed     = Date.now() - Number(loginTime);
            const timeLeft    = SESSION_DURATION_MS - elapsed;

            if (timeLeft <= 0) {
                setExpired(true);
                setWarning(false);
                setRemaining(0);
            } else if (timeLeft <= WARN_BEFORE_MS) {
                setWarning(true);
                setExpired(false);
                setRemaining(Math.ceil(timeLeft / 1000));
            } else {
                setWarning(false);
                setExpired(false);
                setRemaining(null);
            }
        };

        check(); // ejecutar de inmediato al montar
        const interval = setInterval(check, CHECK_INTERVAL_MS);

        return () => clearInterval(interval);
    }, []);

    return { expired, warning, remaining, dismiss };
}
