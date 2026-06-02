import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { cambiodePassword } from '../../services/authApi';

function CambioDePassword() {

    // =====================================
    // NAVIGATE
    // =====================================

    const navigate = useNavigate();

    // =====================================
    // OBTENER DATOS DEL LOCAL STORAGE
    // =====================================

    const correo =
    localStorage.getItem(

        'correo_recuperacion'

    );

    const codigo =
    localStorage.getItem(

        'codigo_recuperacion'

    );

    // =====================================
    // ESTADO
    // =====================================

    const [formulario, setFormulario] = useState({

        correo: correo || '',

        codigo: codigo || '',

        nuevaPassword: '',

        confirmarPassword: ''

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

        // =============================
        // VALIDAR PASSWORDS
        // =============================

        if (

            formulario.nuevaPassword
            !==
            formulario.confirmarPassword

        ) {

            alert(

                'Las contraseñas no coinciden'

            );

            return;

        }

        try {

            const datos = {

                correo: formulario.correo,

                codigo: formulario.codigo,

                nuevaPassword:
                formulario.nuevaPassword

            };

            const respuesta =
            await cambiodePassword(

                datos

            );

            console.log(respuesta);

            alert(

                'Contraseña cambiada correctamente'

            );

            // =========================
            // LIMPIAR STORAGE
            // =========================

            localStorage.removeItem(

                'codigo_recuperacion'

            );

            localStorage.removeItem(

                'correo_recuperacion'

            );

            // =========================
            // REDIRECCIONAR LOGIN
            // =========================

            navigate('/login');

        } catch (error) {

            console.log(error);

            alert(

                'Error cambiando contraseña'

            );

        }

    };

    // =====================================
    // RENDER
    // =====================================

    return (

        <div>

            <h1>Cambiar contraseña</h1>

            <form onSubmit={handleSubmit}>

                <input
                    type="email"
                    name="correo"
                    value={formulario.correo}
                    readOnly
                />

                <br />

                <input
                    type="text"
                    name="codigo"
                    value={formulario.codigo}
                    readOnly
                />

                <br />

                <input
                    type="password"
                    name="nuevaPassword"
                    placeholder="Nueva contraseña"
                    onChange={handleChange}
                />

                <br />

                <input
                    type="password"
                    name="confirmarPassword"
                    placeholder="Confirmar contraseña"
                    onChange={handleChange}
                />

                <br />

                <button type="submit">

                    Cambiar contraseña

                </button>

            </form>

        </div>

    );

}

export default CambioDePassword;