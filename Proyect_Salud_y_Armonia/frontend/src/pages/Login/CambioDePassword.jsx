import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cambiodePassword } from '../../services/authApi';
import { evaluarPassword, mensajeErrorPassword } from '../../utils/passwordStrength';
import PasswordStrengthBar from '../../components/PasswordStrengthBar';
import logo from '../../assets/logo.png';
import './CambioDePassword.css';

function CambioDePassword() {

    const navigate = useNavigate();

    const correo  = localStorage.getItem('correo_recuperacion') || '';
    const codigo  = localStorage.getItem('codigo_recuperacion') || '';

    const [formulario, setFormulario] = useState({
        nuevaPassword:    '',
        confirmarPassword: '',
    });

    const [passwordInfo, setPasswordInfo]     = useState(evaluarPassword(''));
    const [mostrarReglas, setMostrarReglas]   = useState(false);
    const [enviando, setEnviando]             = useState(false);
    const [errorMsg, setErrorMsg]             = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormulario((prev) => ({ ...prev, [name]: value }));
        if (name === 'nuevaPassword') {
            setPasswordInfo(evaluarPassword(value));
        }
        setErrorMsg('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');

        // Validar fortaleza de la nueva contraseña
        const errorPwd = mensajeErrorPassword(formulario.nuevaPassword);
        if (errorPwd) {
            setErrorMsg(errorPwd);
            return;
        }

        // Validar que ambas contraseñas coincidan
        if (formulario.nuevaPassword !== formulario.confirmarPassword) {
            setErrorMsg('Las contraseñas no coinciden');
            return;
        }

        setEnviando(true);
        try {
            await cambiodePassword({
                correo,
                codigo,
                nuevaPassword: formulario.nuevaPassword,
            });

            localStorage.removeItem('codigo_recuperacion');
            localStorage.removeItem('correo_recuperacion');

            navigate('/login');
        } catch (error) {
            console.log(error);
            setErrorMsg(
                error.response?.data?.mensaje ||
                'Error cambiando contraseña'
            );
        } finally {
            setEnviando(false);
        }
    };

    const btnDeshabilitado =
        enviando ||
        (formulario.nuevaPassword.length > 0 && !passwordInfo.valida);

    return (
        <div className="cambio-pwd-contenedor">
            <div className="cambio-pwd-card">

                <img src={logo} alt="Logo" className="cambio-pwd-logo" />

                <h1 className="cambio-pwd-titulo">Nueva contraseña</h1>

                <p className="cambio-pwd-subtitulo">
                    Crea una contraseña segura para tu cuenta
                    {correo && <> — <strong>{correo}</strong></>}
                </p>

                <form className="cambio-pwd-form" onSubmit={handleSubmit}>

                    {/* Campo: nueva contraseña */}
                    <div className="cambio-pwd-field">
                        <input
                            className="cambio-pwd-input"
                            type="password"
                            name="nuevaPassword"
                            placeholder="Nueva contraseña"
                            value={formulario.nuevaPassword}
                            onChange={handleChange}
                            onFocus={() => setMostrarReglas(true)}
                            autoComplete="new-password"
                        />
                        {mostrarReglas && (
                            <PasswordStrengthBar info={passwordInfo} />
                        )}
                    </div>

                    {/* Campo: confirmar contraseña */}
                    <input
                        className="cambio-pwd-input"
                        type="password"
                        name="confirmarPassword"
                        placeholder="Confirmar contraseña"
                        value={formulario.confirmarPassword}
                        onChange={handleChange}
                        autoComplete="new-password"
                    />

                    {/* Mensaje de error */}
                    {errorMsg && (
                        <p className="cambio-pwd-error">{errorMsg}</p>
                    )}

                    <button
                        className="cambio-pwd-btn"
                        type="submit"
                        disabled={btnDeshabilitado}
                    >
                        {enviando ? 'Guardando…' : 'Cambiar contraseña'}
                    </button>

                </form>

            </div>
        </div>
    );
}

export default CambioDePassword;
