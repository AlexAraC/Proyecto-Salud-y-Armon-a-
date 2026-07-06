import { useState } from 'react';
import { Link } from 'react-router-dom';
import { loginUsuario } from '../../services/authApi';
import './Login.css';
import logo from '../../assets/logo.png';

function Login() {

    const [formulario, setFormulario] = useState({

        correo: '',
        contraseña: ''

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

            const respuesta = await loginUsuario(
                formulario
            );

            localStorage.setItem('token', respuesta.data.token);
            localStorage.setItem('loginTime', Date.now().toString());

            window.location.href = '/';

        } catch (error) {

            console.log(error);

            alert(
                error.response?.data?.mensaje ||
                'Login incorrecto'
            );

        }

    };

    return (

        <div className="login-contenedor">

            <div className="login-card">

                <img
                    src={logo}
                    alt="Logo"
                    className="login-logo"
                />

                <h1 className="login-titulo">
                    Bienvenido
                </h1>

                <p className="login-subtitulo">
                    Inicia sesión para continuar
                </p>

                <form
                    className="login-form"
                    onSubmit={handleSubmit}
                >

                    <input
                        className="login-input"
                        type="email"
                        name="correo"
                        placeholder="Correo electrónico"
                        onChange={handleChange}
                    />

                    <input
                        className="login-input"
                        type="password"
                        name="contraseña"
                        placeholder="Contraseña"
                        onChange={handleChange}
                    />

                    <button
                        className="login-btn"
                        type="submit"
                    >

                        Iniciar sesión

                    </button>

                </form>

                <div className="login-enlaces">

                    <Link
                        className="login-link login-link-registro"
                        to="/register"
                    >
                        Crear una cuenta
                    </Link>

                    <Link
                        className="login-link"
                        to="/recuperacion"
                    >
                        ¿Olvidaste tu contraseña?
                    </Link>

                </div>

            </div>

        </div>

    );

}

export default Login;