import axios from 'axios';

const API_URL = 'http://localhost:3000/ventas';

const obtenerToken = () => {
    return localStorage.getItem('token');
};

export const registrarVenta = async (datos) => {
    const respuesta = await axios.post(
        API_URL,
        datos,
        {
            headers: {
                Authorization: `Bearer ${obtenerToken()}`
            }
        }
    );
    return respuesta.data;
};
