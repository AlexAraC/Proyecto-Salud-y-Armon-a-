import { useState } from 'react';

import { crearUsuario } from '../../services/usuariosApi';

function Register() {

    // =====================================
    // ESTADO DEL FORMULARIO
    // =====================================

    const [formulario, setFormulario] = useState({

        nombre: '',
        correo: '',
        contraseña: '',
        direccion: '',
        rol: 'cliente'

    });

    // =====================================
    // ACTUALIZAR INPUTS
    // =====================================

    const handleChange = (e) => {

        setFormulario({

            ...formulario,

            [e.target.name]: e.target.value

        });

    };

    // =====================================
    // ENVIAR FORMULARIO
    // =====================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            await crearUsuario(formulario);

            alert('Usuario creado');

        } catch (error) {

            console.log(error);

            alert('Error al registrar');

        }

    };

    // =====================================
    // RENDER
    // =====================================

    return (

        <div>

            <h1>Registro</h1>

            <form onSubmit={handleSubmit}>

                <input
                    type="text"
                    name="nombre"
                    placeholder="Nombre"
                    onChange={handleChange}//onchange es == detectar cambio
                />

                <br />

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

                <input
                    type="text"
                    name="direccion"
                    placeholder="Dirección"
                    onChange={handleChange}
                />

                <br />

                <button type="submit">

                    Registrarse

                </button>

            </form>

        </div>

    );

}

export default Register;