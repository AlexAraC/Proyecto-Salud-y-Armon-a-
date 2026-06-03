import axios from 'axios';

const API_URL = 'http://localhost:3000/comentarios';

// Obtener todos
export const obtenerComentariosPorTipo = async () => {

    const respuesta = await axios.get(
        `${API_URL}/comunicacion_cliente`
    );

    return respuesta.data;

};

// Crear
export const crearComentario = async (comentario) => {

    const respuesta = await axios.post(
        API_URL,
        comentario
    );

    return respuesta.data;

};

// Actualizar
export const actualizarComentario = async (id, comentario) => {

    const respuesta = await axios.put(
        `${API_URL}/${id}`,
        comentario
    );

    return respuesta.data;

};

// Eliminar
export const eliminarComentario = async (id) => {

    const respuesta = await axios.delete(
        `${API_URL}/${id}`
    );

    return respuesta.data;

};

export const obtenerComentariosSeparados = obtenerComentariosPorTipo;