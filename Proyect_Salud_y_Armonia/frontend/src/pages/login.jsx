import { useState } from 'react';

import { loginUsuario } from '../services/authApi';

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

            </form>

        </div>

    );

}

export default Login;