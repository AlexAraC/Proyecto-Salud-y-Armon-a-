import './SessionExpiredModal.css';

/**
 * Modal de sesión caducada / por caducar.
 *
 * Props:
 *   - mode      : 'warning' | 'expired'
 *   - remaining : segundos restantes (solo en mode='warning')
 *   - onStay    : callback para renovar sesión (mode='warning')
 *   - onLogout  : callback para cerrar sesión ahora
 */
function SessionExpiredModal({ mode, remaining, onStay, onLogout }) {
    if (!mode) return null;

    const isExpired = mode === 'expired';

    return (
        <div className="sem-overlay" role="dialog" aria-modal="true" aria-labelledby="sem-titulo">
            <div className="sem-card">

                <div className="sem-icono" aria-hidden="true">
                    {isExpired ? '🔒' : '⏳'}
                </div>

                <h2 className="sem-titulo" id="sem-titulo">
                    {isExpired ? 'Sesión caducada' : 'Tu sesión está por expirar'}
                </h2>

                <p className="sem-mensaje">
                    {isExpired
                        ? 'Tu sesión ha expirado por inactividad. Por seguridad, serás redirigido al inicio.'
                        : `Tu sesión cerrará en ${remaining} segundo${remaining !== 1 ? 's' : ''}. ¿Deseas continuar?`
                    }
                </p>

                <div className="sem-acciones">
                    {isExpired ? (
                        <button className="sem-btn sem-btn-principal" onClick={onLogout}>
                            Ir al inicio
                        </button>
                    ) : (
                        <>
                            <button className="sem-btn sem-btn-principal" onClick={onStay}>
                                Seguir conectado
                            </button>
                            <button className="sem-btn sem-btn-secundario" onClick={onLogout}>
                                Cerrar sesión
                            </button>
                        </>
                    )}
                </div>

            </div>
        </div>
    );
}

export default SessionExpiredModal;
