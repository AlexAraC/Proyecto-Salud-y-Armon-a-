import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { verificarCodigoG } from '../../services/authApi';
import './VerificarCodigoUsuario.css';
import logo from '../../assets/logo.png';

function VerificacionCodigo() {

    const navigate = useNavigate();

    const [formulario, setFormulario] = useState({

        correo: '',

        codigo: ''

    });

    const handleChange = (e) => {

        setFormulario({

            ...formulario,

            [e.target.name]: e.target.value

        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const respuesta = await verificarCodigoG(formulario);

            console.log(respuesta);

            localStorage.setItem('codigo_recuperacion', formulario.codigo);

            localStorage.setItem('correo_recuperacion', formulario.correo);

            alert('Código correcto');

            navigate('/cambio_de_password');

        } catch (error) {

            console.log(error);

            alert('Código incorrecto');

        }

    };

    return (

        <div className="verificar-contenedor">

            <div className="verificar-card">

                <img
                    src={logo}
                    alt="Logo"
                    className="verificar-logo"
                />

                <h1 className="verificar-titulo">
                    Verificar Código
                </h1>

                <p className="verificar-subtitulo">
                    Ingresa el código que enviamos a tu correo electrónico
                </p>

                <form
                    className="verificar-form"
                    onSubmit={handleSubmit}
                >

                    <input
                        className="verificar-input"
                        type="email"
                        name="correo"
                        placeholder="Correo electrónico"
                        onChange={handleChange}
                    />

                    <input
                        className="verificar-input"
                        type="text"
                        name="codigo"
                        placeholder="Código de verificación"
                        onChange={handleChange}
                    />

                    <button
                        className="verificar-btn"
                        type="submit"
                    >
                        Verificar código
                    </button>

                </form>

                <div className="verificar-enlaces">

                    <Link
                        className="verificar-link"
                        to="/recuperacion"
                    >
                        Reenviar código
                    </Link>

                    <Link
                        className="verificar-link"
                        to="/login"
                    >
                        Volver al inicio de sesión
                    </Link>

                </div>

            </div>

        </div>

    );

}

export default VerificacionCodigo;