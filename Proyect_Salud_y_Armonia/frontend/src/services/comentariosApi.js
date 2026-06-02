import axios from 'axios';

const API_URL = 'http://localhost:3000/comentarios';

export const obtenerComentariosPorTipo = async () => {

    try {

        const respuesta = await axios.get(
            `${API_URL}/comunicacion_cliente`
        );

        return respuesta.data;

    }

    catch (error) {

        console.error(error);

        throw error;

    }

};
