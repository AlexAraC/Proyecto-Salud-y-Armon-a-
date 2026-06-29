import axios from 'axios';

const API_URL = 'http://localhost:3000/carrito';

const obtenerToken = () => localStorage.getItem('token');

export const obtenerCarrito = async () => {
    const respuesta = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${obtenerToken()}` }
    });
    return respuesta.data;
};

export const agregarAlCarrito = async (producto_id, cantidad) => {
    const respuesta = await axios.post(API_URL, { producto_id, cantidad }, {
        headers: { Authorization: `Bearer ${obtenerToken()}` }
    });
    return respuesta.data;
};

export const actualizarCantidad = async (producto_id, cantidad) => {
    const respuesta = await axios.put(API_URL, { producto_id, cantidad }, {
        headers: { Authorization: `Bearer ${obtenerToken()}` }
    });
    return respuesta.data;
};

export const eliminarDelCarrito = async (producto_id) => {
    const respuesta = await axios.delete(API_URL, {
        headers: { Authorization: `Bearer ${obtenerToken()}` },
        data: { producto_id }
    });
    return respuesta.data;
};

export const vaciarCarrito = async () => {
    const respuesta = await axios.delete(`${API_URL}/vaciar`, {
        headers: { Authorization: `Bearer ${obtenerToken()}` }
    });
    return respuesta.data;
};

export const checkoutCarrito = async (datos = {}) => {
    const respuesta = await axios.post(`${API_URL}/checkout`, datos, {
        headers: { Authorization: `Bearer ${obtenerToken()}` }
    });
    return respuesta.data;
};
