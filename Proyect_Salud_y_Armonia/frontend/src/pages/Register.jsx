import { useState } from 'react';
import { crearUsuario } from '../services/usuariosApi';

function Register() {

    const [formulario, setFormulario] = useState({

        nombre: '',
        correo: '',
        contraseña: '',
        rol: 'cliente',
        direccion: ''

    });

    // =====================================
    // CAMBIOS EN INPUTS
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

        alert('el registro fallo')

        console.log(error);

    }

    };


    return (

        <div>

            <h1>Registro</h1>

            <form onSubmit={handleSubmit}>

                <input
                    type="text"
                    name="nombre"
                    placeholder="Nombre"
                    onChange={handleChange}
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
                    name="password"
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

                    Crear Usuario

                </button>

            </form>

        </div>

    );

}

export default Register;