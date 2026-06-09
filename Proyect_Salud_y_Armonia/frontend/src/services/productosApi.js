import axios from 'axios';

const API_URL = 'http://localhost:3000/productos';

const obtenerToken = () => {
    return localStorage.getItem('token');
};

// =====================================
// OBTENER TODOS
// =====================================

export const obtenerProductos = async () => {

    const respuesta = await axios.get(
        API_URL
    );

    return respuesta.data;

};

export const obtenerDestacados = async () => {
    const respuesta = await axios.get(
        `${API_URL}/destacados`
    );
    return respuesta.data
}



// =====================================
// OBTENER POR ID
// =====================================

export const obtenerProductoPorId = async (id) => {

    const respuesta = await axios.get(
        `${API_URL}/${id}`
    );

    return respuesta.data;

};

// =====================================
// CREAR PRODUCTO
// =====================================

export const crearProducto = async (producto) => {

    const formData = new FormData();

    formData.append(
        'nombre',
        producto.nombre
    );

    formData.append(
        'descripcion',
        producto.descripcion
    );

    formData.append(
        'precio',
        producto.precio
    );

    formData.append(
        'categoria_id',
        producto.categoria_id
    );

    formData.append(
        'stock',
        producto.stock
    );

    if (producto.imagen) {

        formData.append(
            'imagen',
            producto.imagen
        );

    }

    const respuesta = await axios.post(

        API_URL,

        formData,

        {
            headers: {
                Authorization:
                    `Bearer ${obtenerToken()}`
            }
        }

    );

    return respuesta.data;

};

// =====================================
// ACTUALIZAR PRODUCTO
// =====================================

export const actualizarProducto = async (

    id,
    producto

) => {

    const formData = new FormData();

    formData.append(
        'nombre',
        producto.nombre
    );

    formData.append(
        'descripcion',
        producto.descripcion
    );

    formData.append(
        'precio',
        producto.precio
    );

    formData.append(
        'categoria_id',
        producto.categoria_id
    );

    formData.append(
        'stock',
        producto.stock
    );

    if (producto.imagen) {

        formData.append(
            'imagen',
            producto.imagen
        );

    }

    const respuesta = await axios.put(

        `${API_URL}/${id}`,

        formData,

        {
            headers: {
                Authorization:
                    `Bearer ${obtenerToken()}`
            }
        }

    );

    return respuesta.data;

};

export const agregarDestacado = async (id) => {

    const respuesta = await axios.put(

        `${API_URL}/destacados/${id}`,

        {},

        {
            headers: {
                Authorization: `Bearer ${obtenerToken()}`
            }
        }

    );

    return respuesta.data;

};
export const quitarDestacado = async (id) => {

    const respuesta = await axios.delete(

        `${API_URL}/destacados/${id}`,

        {
            headers: {
                Authorization: `Bearer ${obtenerToken()}`
            }
        }

    );

    return respuesta.data;

};

// =====================================
// ELIMINAR PRODUCTO
// =====================================

export const eliminarProducto = async (id) => {

    const respuesta = await axios.delete(

        `${API_URL}/${id}`,

        {
            headers: {
                Authorization:
                    `Bearer ${obtenerToken()}`
            }
        }

    );

    return respuesta.data;

};