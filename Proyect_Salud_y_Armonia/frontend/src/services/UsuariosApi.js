import axios from 'axios';

const API_URL =
    'http://localhost:3000/usuarios';


// =====================================
// OBTENER TOKEN
// =====================================

const obtenerToken = () => {

    return localStorage.getItem('token');

};


// =====================================
// OBTENER USUARIOS
// =====================================

export const obtenerUsuarios = async () => {

    const respuesta = await axios.get(

        API_URL,

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
// CREAR USUARIO
// =====================================

export const crearUsuario = async (usuario) => {

    const respuesta = await axios.post(

        API_URL,

        usuario

    );

    return respuesta.data;

};


// =====================================
// ACTUALIZAR USUARIO
// =====================================

export const actualizarUsuario = async (

    id,

    usuario

) => {

    const respuesta = await axios.put(

        `${API_URL}/${id}`,

        usuario,

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
// ELIMINAR USUARIO
// =====================================

export const eliminarUsuario = async (id) => {

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


// =====================================
// CAMBIAR ROL
// =====================================

export const cambiarRol = async (

    id,

    rol

) => {

    const respuesta = await axios.put(

        `${API_URL}/${id}/rol`,

        {

            rol

        },

        {

            headers: {

                Authorization:
                    `Bearer ${obtenerToken()}`

            }

        }

    );

    return respuesta.data;

};