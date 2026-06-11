import axios from 'axios';

const API_URL =
    'http://localhost:3000/informacion-ceo';


// =====================================
// OBTENER TOKEN
// =====================================

const obtenerToken = () => {

    return localStorage.getItem('token');

};


// =====================================
// OBTENER INFORMACIÓN CEO
// =====================================

export const obtenerInformacionCeo = async () => {

    const respuesta = await axios.get(
        API_URL
    );

    return respuesta.data;

};


// =====================================
// CREAR INFORMACIÓN CEO
// =====================================

export const crearInformacionCeo = async (informacion) => {

    const formData = new FormData();

    formData.append(
        'nombre',
        informacion.nombre
    );

    formData.append(
        'correo',
        informacion.correo
    );

    formData.append(
        'telefono',
        informacion.telefono
    );

    if (informacion.imagen) {

        formData.append(
            'imagen',
            informacion.imagen
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
// ACTUALIZAR INFORMACIÓN CEO
// =====================================

export const actualizarInformacionCeo = async (

    id,

    informacion

) => {

    const formData = new FormData();

    formData.append(
        'nombre',
        informacion.nombre
    );

    formData.append(
        'slogan',
        informacion.slogan
    )

    formData.append(
        'correo',
        informacion.correo
    );

    formData.append(
        'telefono',
        informacion.telefono
    );

    if (informacion.imagen) {

        formData.append(
            'imagen',
            informacion.imagen
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


// =====================================
// ELIMINAR INFORMACIÓN CEO
// =====================================

export const eliminarInformacionCeo = async (id) => {

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