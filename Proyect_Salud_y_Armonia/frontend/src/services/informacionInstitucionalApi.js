import axios from 'axios';

const API_URL =
    'http://localhost:3000/informacion-institucional';


// =====================================
// OBTENER TOKEN
// =====================================

const obtenerToken = () => {

    return localStorage.getItem('token');

};


// =====================================
// OBTENER INFORMACIÓN INSTITUCIONAL
// =====================================

export const obtenerInformacionInstitucional =
    async () => {

        const respuesta = await axios.get(
            API_URL
        );

        return respuesta.data;

};


// =====================================
// CREAR INFORMACIÓN INSTITUCIONAL
// =====================================

export const crearInformacionInstitucional =
    async (informacion) => {

        const formData = new FormData();

        formData.append(
            'slogan',
            informacion.slogan
        );

        formData.append(
            'descripcion',
            informacion.descripcion
        );

        formData.append(
            'telefono',
            informacion.telefono
        );

        formData.append(
            'correo',
            informacion.correo
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
// ACTUALIZAR INFORMACIÓN INSTITUCIONAL
// =====================================

export const actualizarInformacionInstitucional =
    async (

        id,

        informacion

    ) => {

        const formData = new FormData();

        formData.append(
            'slogan',
            informacion.slogan
        );

        formData.append(
            'descripcion',
            informacion.descripcion
        );

        formData.append(
            'telefono',
            informacion.telefono
        );

        formData.append(
            'correo',
            informacion.correo
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
// ELIMINAR INFORMACIÓN INSTITUCIONAL
// =====================================

export const eliminarInformacionInstitucional =
    async (id) => {

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