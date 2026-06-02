import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { verificarCodigoG }

from '../../services/authApi';

function VerificacionCodigo() {

    // =====================================
    // NAVIGATE
    // =====================================

    const navigate = useNavigate();

    // =====================================
    // ESTADO
    // =====================================

    const [formulario, setFormulario] = useState({

        correo: '',

        codigo: ''

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

            const respuesta =
            await verificarCodigoG(

                formulario

            );

            console.log(respuesta);

            // =================================
            // GUARDAR EN LOCAL STORAGE
            // =================================

            localStorage.setItem(

                'codigo_recuperacion',

                formulario.codigo

            );

            localStorage.setItem(

                'correo_recuperacion',

                formulario.correo

            );

            alert('Código correcto');

            // =================================
            // REDIRECCIONAR
            // =================================

            navigate('/cambio_de_password');

        } catch (error) {

            console.log(error);

            alert('Código incorrecto');

        }

    };

    // =====================================
    // RENDER
    // =====================================

    return (

        <div>

            <h1>Verificación de código</h1>

            <form onSubmit={handleSubmit}>

                <input
                    type="text"
                    name="correo"
                    placeholder="Correo"
                    onChange={handleChange}
                />

                <br />

                <input
                    type="text"
                    name="codigo"
                    placeholder="Código"
                    onChange={handleChange}
                />

                <br />

                <button type="submit">

                    Verificar código

                </button>

            </form>

        </div>

    );

}

export default VerificacionCodigo;