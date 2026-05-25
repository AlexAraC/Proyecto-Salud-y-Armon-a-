import axios from 'axios';

const API_URL = 'http://localhost:3000/auth';

export const loginUsuario = async (datos) => {

    return await axios.post(

        `${API_URL}/login`,

        datos

    );

};