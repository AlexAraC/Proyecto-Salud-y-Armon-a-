import { useState } from 'react';
import axios from 'axios';

function Register() {

    const [formulario, setFormulario] = useState({

        nombre: '',
        correo: '',
        password: '',
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

            const respuesta = await axios.post(

                'http://localhost:3000/api/usuarios',

                formulario

            );

            console.log(respuesta.data);

            alert('Usuario creado');

        } catch (error) {

            console.log(error);

            alert('Error');

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