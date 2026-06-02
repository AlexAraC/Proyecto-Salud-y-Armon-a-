import './Footer.css';

function Footer() {
    return (
        <footer className="footer">

            <div className="footer-contenedor">

                <div className="footer-seccion">
                    <h3>Salud y Armonía</h3>
                    <p>
                        Tu bienestar es nuestra prioridad.
                        Productos naturales seleccionados para
                        acompañarte cada día.
                    </p>
                </div>

                <div className="footer-seccion">
                    <h3>Contacto</h3>
                    <p>📍 San José, Costa Rica</p>
                    <p>📞 +506 2222-3333</p>
                    <p>✉️ contacto@saludyarmonia.com</p>
                </div>

                <div className="footer-seccion">
                    <h3>Horarios</h3>
                    <p>Lunes a Viernes</p>
                    <p>8:00 a.m. - 6:00 p.m.</p>
                    <p>Sábados: 9:00 a.m. - 3:00 p.m.</p>
                </div>

            </div>

            <div className="footer-copy">
                © 2026 Salud y Armonía. Todos los derechos reservados.
            </div>

        </footer>
    );
}

export default Footer;