import axios from 'axios';

const API_URL = 'http://localhost:3000/estadisticas';

export const obtenerEstadisticas = async () => {

    try {

        const token = localStorage.getItem('token');

        const respuesta = await axios.get(
            API_URL,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        return respuesta.data;

    } catch (error) {

        console.error(error);

        throw error;

    }

};