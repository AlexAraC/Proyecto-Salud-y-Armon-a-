import axios from 'axios';

const API_URL = 'http://localhost:3000/auth';

export const loginUsuario = async (datos) => {

    return await axios.post(

        `${API_URL}/login`,

        datos

    );

};

export const enviarCodigo = async (gmail) => {

    return await axios.post(

        `${API_URL}/recuperar-password`,

        gmail

    );

};

export const verificarCodigoG = async (datos) => {
    return await axios.post(

         `${API_URL}/verificar-codigo`,

         datos
    )
    
}

export const cambiodePassword = async (datos) => {

    return await axios.post(

        `${API_URL}/nueva-password`,

        datos

    )


}

export const logout = async (req, res) => {

    return await axios.post(

        `${API_URL}/logout`

    )
    
}