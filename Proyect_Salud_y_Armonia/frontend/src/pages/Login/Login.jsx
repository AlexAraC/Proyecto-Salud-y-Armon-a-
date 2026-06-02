import { useState } from 'react';
import { Link } from 'react-router-dom';
import { loginUsuario } from '../../services/authApi';

function Login() {

    // =====================================
    // ESTADO
    // =====================================

    const [formulario, setFormulario] = useState({

        correo: '',
        contraseña: ''

    });

    // =====================================
    // HANDLE CHANGE
    // =====================================

    const handleChange = (e) => {

        setFormulario({

            ...formulario,

            [e.target.name]: e.target.value

        });

    };

    // =====================================
    // HANDLE SUBMIT
    // =====================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const respuesta = await loginUsuario(
                formulario
            );

            localStorage.setItem(
                'token',

                respuesta.data.token
            );

            alert('Login correcto');

            window.location.href = '/administracion';

        } catch (error) {

            console.log(error);

            alert('Login incorrecto');

        }

    };

    // =====================================
    // RENDER
    // =====================================

    return (

        <div>

            <h1>Login</h1>

            <form onSubmit={handleSubmit}>

                <input
                    type="email"
                    name="correo"
                    placeholder="Correo"
                    onChange={handleChange}
                />

                <br />

                <input
                    type="password"
                    name="contraseña"
                    placeholder="Contraseña"
                    onChange={handleChange}
                />

                <br />

                <button type="submit">

                    Iniciar sesión

                </button>
                <br />
                <Link to="/register">Registrate</Link> 
                <br />
                <Link to="/recuperacion">¿Olvidaste tu contraseña?</Link>

            </form>

        </div>

    );

}

export default Login;