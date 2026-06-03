import axios from 'axios';

const API_URL = 'http://localhost:3000/categorias';

const obtenerConfigAuth = () => {

    const token = localStorage.getItem('token');

    if (!token) {

        return {};

    }

    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };

};

export const obtenerCategorias = async () => {

    const respuesta = await axios.get(API_URL);
    return respuesta.data;

};

export const crearCategoria = async (categoria) => {

    const respuesta = await axios.post(
        API_URL,
        categoria,
        obtenerConfigAuth()
    );
    return respuesta.data;

};

export const actualizarCategoria = async (id, categoria) => {

    const respuesta = await axios.put(
        `${API_URL}/${id}`,
        categoria,
        obtenerConfigAuth()
    );

    return respuesta.data;

};

export const eliminarCategoria = async (id) => {

    const respuesta = await axios.delete(
        `${API_URL}/${id}`,
        obtenerConfigAuth()
    );

    return respuesta.data;

};
