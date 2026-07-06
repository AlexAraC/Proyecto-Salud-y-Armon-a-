import './PasswordStrengthBar.css';

/**
 * Indicador visual de fortaleza de contraseña.
 * Recibe el objeto `info` devuelto por evaluarPassword().
 */
function PasswordStrengthBar({ info }) {
    if (!info) return null;

    const { reglas, nivel, mensaje } = info;

    const COLORES = ['', '#e74c3c', '#e67e22', '#f1c40f', '#2ecc71'];
    const color = COLORES[nivel] || '#ccc';

    return (
        <div className="psb-contenedor">

            {/* Barra de nivel */}
            <div className="psb-barra-fondo">
                {[1, 2, 3, 4].map((i) => (
                    <div
                        key={i}
                        className="psb-segmento"
                        style={{
                            backgroundColor: nivel >= i ? color : '#e0d8d0',
                            transition: 'background-color .25s ease',
                        }}
                    />
                ))}
            </div>

            {/* Etiqueta de nivel */}
            {mensaje && (
                <span className="psb-etiqueta" style={{ color }}>
                    {mensaje}
                </span>
            )}

            {/* Lista de reglas */}
            <ul className="psb-reglas">
                {reglas.map((r) => (
                    <li
                        key={r.id}
                        className={`psb-regla ${r.cumple ? 'cumple' : 'falta'}`}
                    >
                        <span className="psb-icono">{r.cumple ? '✓' : '✗'}</span>
                        {r.label}
                    </li>
                ))}
            </ul>

        </div>
    );
}

export default PasswordStrengthBar;
