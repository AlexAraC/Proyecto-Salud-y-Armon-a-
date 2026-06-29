import { useState } from 'react';
import { Link } from 'react-router-dom';
import { crearUsuario } from '../../services/usuariosApi';
import './Registrarse.css';
import logo from '../../assets/logo.png';

function Register() {

    const [formulario, setFormulario] = useState({
        nombre: '',
        correo: '',
        contraseña: '',
        telefono: '',
        direccion: '',
        rol: 'usuario'
    });

    const handleChange = (e) => {

        setFormulario({
            ...formulario,
            [e.target.name]: e.target.value
        });

    };

    const [registrado, setRegistrado] = useState(false);

    const handleSubmit = async (e) => {

        e.preventDefault();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formulario.correo)) {
            alert('Ingresa un correo electrónico válido');
            return;
        }

        try {

            const respuesta = await crearUsuario(formulario);
            setRegistrado(true);

        } catch (error) {

            console.log(error);

            alert(
                error.response?.data?.mensaje ||
                'Error al registrar'
            );

        }

    };

    if (registrado) {
        return (
            <div className="register-contenedor">
                <div className="register-card" style={{ textAlign: 'center' }}>
                    <h1 className="register-titulo">Revisa tu correo</h1>
                    <p className="register-subtitulo">
                        Te enviamos un enlace de verificación a <strong>{formulario.correo}</strong>.
                        Haz clic en el enlace para activar tu cuenta.
                    </p>
                    <Link
                        to="/login"
                        className="register-btn"
                        style={{
                            display: 'inline-block',
                            marginTop: '20px',
                            padding: '12px 28px',
                            background: '#6f8c4e',
                            color: 'white',
                            textDecoration: 'none',
                            borderRadius: '10px',
                            fontWeight: 700,
                            border: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        Ir a iniciar sesión
                    </Link>
                </div>
            </div>
        );
    }

    return (

        <div className="register-contenedor">

            <div className="register-card">

                <img
                    src={logo}
                    alt="Logo"
                    className="register-logo"
                />

                <h1 className="register-titulo">
                    Crear Cuenta
                </h1>

                <p className="register-subtitulo">
                    Regístrate para comenzar
                </p>

                <form
                    className="register-form"
                    onSubmit={handleSubmit}
                >

                    <input
                        className="register-input"
                        type="text"
                        name="nombre"
                        placeholder="Nombre completo"
                        onChange={handleChange}
                    />

                    <input
                        className="register-input"
                        type="email"
                        name="correo"
                        placeholder="Correo electrónico"
                        onChange={handleChange}
                    />

                    <input
                        className="register-input"
                        type="password"
                        name="contraseña"
                        placeholder="Contraseña"
                        onChange={handleChange}
                    />

                    <input
                        className="register-input"
                        type="text"
                        name="telefono"
                        placeholder="Teléfono"
                        onChange={handleChange}
                    />

                    <input
                        className="register-input"
                        type="text"
                        name="direccion"
                        placeholder="Dirección"
                        onChange={handleChange}
                    />

                    <button
                        className="register-btn"
                        type="submit"
                    >
                        Registrarse
                    </button>

                </form>

                <div className="register-enlaces">

                    <Link
                        className="register-link"
                        to="/login"
                    >
                        ¿Ya tienes cuenta? Inicia sesión
                    </Link>

                </div>

            </div>

        </div>

    );

}

export default Register;