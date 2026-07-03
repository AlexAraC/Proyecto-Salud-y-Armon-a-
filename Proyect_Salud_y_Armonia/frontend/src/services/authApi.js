import axios from 'axios';

// Servicio de autenticación: maneja login, recuperación de contraseña y logout.
const API_URL = 'http://localhost:3000/auth';

// Inicia sesión del usuario con correo y contraseña.
// @param {Object} datos - Objeto con credenciales (email, password).
// @returns {Promise} Respuesta del servidor con token y datos del usuario.
export const loginUsuario = async (datos) => {

    return await axios.post(

        `${API_URL}/login`,

        datos

    );

};

// Envía un código de recuperación al correo del usuario.
// @param {Object} gmail - Objeto con el correo del usuario.
// @returns {Promise} Respuesta del servidor.
export const enviarCodigo = async (gmail) => {

    return await axios.post(

        `${API_URL}/recuperar-password`,

        gmail

    );

};

// Verifica que el código ingresado por el usuario sea correcto.
// @param {Object} datos - Objeto con el código y correo.
// @returns {Promise} Respuesta del servidor.
export const verificarCodigoG = async (datos) => {
    return await axios.post(

         `${API_URL}/verificar-codigo`,

         datos
    )
    
}

// Cambia la contraseña del usuario después de verificar el código.
// @param {Object} datos - Objeto con la nueva contraseña y token de recuperación.
// @returns {Promise} Respuesta del servidor.
export const cambiodePassword = async (datos) => {

    return await axios.post(

        `${API_URL}/nueva-password`,

        datos

    )


}

// Cierra la sesión del usuario en el servidor.
// @returns {Promise} Respuesta del servidor.
export const logout = async () => {

    return await axios.post(

        `${API_URL}/logout`

    )
    
}
