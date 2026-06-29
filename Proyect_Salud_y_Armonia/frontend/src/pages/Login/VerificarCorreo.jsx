import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';

function VerificarCorreo() {

    const [searchParams] = useSearchParams();
    const [mensaje, setMensaje] = useState('Verificando...');
    const [error, setError] = useState(false);

    useEffect(() => {
        const token = searchParams.get('token');
        if (!token) {
            setMensaje('Token de verificación no encontrado');
            setError(true);
            return;
        }
        axios.get(`http://localhost:3000/usuarios/verificar/${token}`)
            .then(() => {
                setMensaje('Correo verificado correctamente. Ya puedes iniciar sesión.');
            })
            .catch((err) => {
                setMensaje(err.response?.data?.mensaje || 'Error al verificar el correo');
                setError(true);
            });
    }, [searchParams]);

    return (
        <div className="login-contenedor">
            <div className="login-card" style={{ textAlign: 'center' }}>
                <h1 className="login-titulo" style={{ color: error ? '#B86F5C' : '#6f8c4e' }}>
                    {error ? 'Error' : 'Verificado'}
                </h1>
                <p className="login-subtitulo">{mensaje}</p>
                {!error && (
                    <Link
                        to="/login"
                        className="register-btn"
                        style={{
                            display: 'inline-block',
                            marginTop: '20px',
                            padding: '12px 28px',
                            background: '#6f8c4e',
                            color: 'white',
                            textDecoration: 'none',
                            borderRadius: '10px',
                            fontWeight: 700
                        }}
                    >
                        Iniciar sesión
                    </Link>
                )}
            </div>
        </div>
    );
}

export default VerificarCorreo;
