import axios from 'axios';

const API_URL =
    'http://localhost:3000/pedidos';


// =====================================
// OBTENER TOKEN
// =====================================

const obtenerToken = () => {

    return localStorage.getItem('token');

};


// =====================================
// CREAR PEDIDO
// =====================================

export const crearPedido = async (pedido) => {

    const respuesta = await axios.post(

        API_URL,

        pedido,

        {

            headers: {

                Authorization:
                    `Bearer ${obtenerToken()}`

            }

        }

    );

    return respuesta.data;

};

export const obtenerPedidosPorUsuario = async (id) => {

    const respuesta = await axios.get(

        `${API_URL}/usuario/${id}`,

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
// VER PEDIDOS DEL CLIENTE
// =====================================

export const obtenerPedidosCliente = async () => {

    const respuesta = await axios.get(

        `${API_URL}/cliente`,

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
// CANCELAR PEDIDO
// =====================================

export const cancelarPedido = async (id) => {

    const respuesta = await axios.put(

        `${API_URL}/${id}/cancelar`,

        {},

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
// ACTUALIZAR ESTADO DEL PEDIDO
// =====================================

export const actualizarEstadoPedido = async (

    id,

    estado

) => {

    const respuesta = await axios.put(

        `${API_URL}/${id}`,

        {

            estado

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


// =====================================
// VER TODOS LOS PEDIDOS (ADMIN)
// =====================================

export const obtenerPedidosAdmin = async () => {

    const respuesta = await axios.get(

        `${API_URL}/admin`,

        {

            headers: {

                Authorization:
                    `Bearer ${obtenerToken()}`

            }

        }

    );

    return respuesta.data;

};

export const obtenerPedidoPorId = async (id) => {

    const respuesta = await axios.get(

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
// OBTENER ESTADÍSTICAS
// =====================================

export const obtenerEstadisticasPedidos = async () => {

    const respuesta = await axios.get(

        `${API_URL}/Estadisticas`,

        {

            headers: {

                Authorization:
                    `Bearer ${obtenerToken()}`

            }

        }

    );

    return respuesta.data;

};