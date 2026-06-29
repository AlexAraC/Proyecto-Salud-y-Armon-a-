import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { enviarCodigo } from '../../services/authApi';
import './RecuperacionCodigo.css';
import logo from '../../assets/logo.png';

function RecuperacionCodigo() {

    const navigate = useNavigate();

    const [gmail, setGmail] = useState({

        correo: ''

    });

    const handleChange = (e) => {

        setGmail({

            ...gmail,

            [e.target.name]: e.target.value

        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const respuesta = await enviarCodigo(gmail);

            console.log(respuesta);

            alert('Código enviado');

            navigate('/verificacion-codigo');

        } catch (error) {

            console.log(error);

            alert('Algo salió mal');

        }

    };

    return (

        <div className="recuperacion-contenedor">

            <div className="recuperacion-card">

                <img
                    src={logo}
                    alt="Logo"
                    className="recuperacion-logo"
                />

                <h1 className="recuperacion-titulo">
                    Recuperar Contraseña
                </h1>

                <p className="recuperacion-subtitulo">
                    Ingresa tu correo electrónico y te enviaremos un código para restablecer tu contraseña
                </p>

                <form
                    className="recuperacion-form"
                    onSubmit={handleSubmit}
                >

                    <input
                        className="recuperacion-input"
                        type="email"
                        name="correo"
                        placeholder="Correo electrónico"
                        onChange={handleChange}
                    />

                    <button
                        className="recuperacion-btn"
                        type="submit"
                    >
                        Enviar código
                    </button>

                </form>

                <div className="recuperacion-enlaces">

                    <Link
                        className="recuperacion-link"
                        to="/login"
                    >
                        Volver al inicio de sesión
                    </Link>

                </div>

            </div>

        </div>

    );

}

export default RecuperacionCodigo;