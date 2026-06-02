import axios from 'axios';

const API_URL = 'http://localhost:3000/estadisticas';

export const obtenerEstadisticas = async () => {

    try {

        const respuesta = await axios.get(API_URL);

        return respuesta.data;

    }

    catch (error) {

        console.error(error);

        throw error;

    }

};