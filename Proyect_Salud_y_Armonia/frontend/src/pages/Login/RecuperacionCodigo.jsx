import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { enviarCodigo }

from '../../services/authApi';

function RecuperacionCodigo() {

    // =====================================
    // NAVIGATE
    // =====================================

    const navigate = useNavigate();

    // =====================================
    // ESTADO
    // =====================================

    const [gmail, setGmail] = useState({

        correo: ''

    });

    // =====================================
    // HANDLE CHANGE
    // =====================================

    const handleChange = (e) => {

        setGmail({

            ...gmail,

            [e.target.name]: e.target.value

        });

    };

    // =====================================
    // HANDLE SUBMIT
    // =====================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const respuesta = await enviarCodigo(
                gmail
            );

            console.log(respuesta);

            alert('Código enviado');

            // =========================
            // REDIRECCIÓN
            // =========================

            navigate('/verificacion-codigo');

        } catch (error) {

            console.log(error);

            alert('Algo salió mal');

        }

    };

    // =====================================
    // RENDER
    // =====================================

    return (

        <div>

            <h1>Zona de recuperación</h1>

            <form onSubmit={handleSubmit}>

                <input
                    type="email"
                    name="correo"
                    placeholder="Correo de recuperación"
                    onChange={handleChange}
                />

                <br />

                <button type="submit">

                    Enviar

                </button>

            </form>

        </div>

    );

}

export default RecuperacionCodigo;