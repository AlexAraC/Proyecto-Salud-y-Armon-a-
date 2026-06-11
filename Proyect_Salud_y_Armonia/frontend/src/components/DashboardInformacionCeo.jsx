import { useEffect, useState } from 'react';

import {

    obtenerInformacionCeo,
    crearInformacionCeo,
    actualizarInformacionCeo

}

from '../services/informacionCeoApi';

import './DashboardInformacionCeo.css';

function DashboardInformacionCeo({tipo}) {

    const [informacion, setInformacion] =
        useState(null);

    const [formulario, setFormulario] =
        useState({

            nombre: '',
            correo: '',
            telefono: '',
            imagen: null

        });


    // =====================================
    // CARGAR INFORMACIÓN
    // =====================================

    const cargarInformacion = async () => {

        try {

            const respuesta =
                await obtenerInformacionCeo();

            if (

                respuesta.informacion.length > 0

            ) {

                const ceo =
                    respuesta.informacion[0];

                setInformacion(
                    ceo
                );

                setFormulario({

                    nombre:
                        ceo.nombre,

                    correo:
                        ceo.correo,

                    telefono:
                        ceo.telefono,
                    slogan:
                        ceo.slogan,

                    imagen: null

                });

            }

        } catch (error) {

            console.log(error);

        }

    };


    useEffect(() => {

        cargarInformacion();

    }, []);


    // =====================================
    // INPUTS
    // =====================================

    const handleChange = (e) => {

        setFormulario({

            ...formulario,

            [e.target.name]:
                e.target.value

        });

    };


    // =====================================
    // FOTO
    // =====================================

    const handleImagen = (e) => {

        setFormulario({

            ...formulario,

            imagen:
                e.target.files[0]

        });

    };


    // =====================================
    // GUARDAR
    // =====================================

    const guardarInformacion =
        async () => {

            try {

                if (informacion) {

                    await actualizarInformacionCeo(

                        informacion.id,

                        formulario

                    );

                }

                else {

                    await crearInformacionCeo(

                        formulario

                    );

                }

                await cargarInformacion();

                alert(
                    'Información guardada correctamente'
                );

            }

            catch (error) {

                console.log(error);

            }

        };


    return (

        <div
            className="dashboard-ceo"
        >

            <h1>

                Información del CEO

            </h1>

            <div
                className="contenedor-ceo"
            >

                <img

                    className="foto-ceo"

                    src={

                        informacion?.imagen

                            ?

                            `http://localhost:3000${informacion.imagen}`

                            :

                            'http://localhost:3000/uploads/ceo.png'

                    }

                    alt="CEO"

                />


                <div className="formulario-ceo">

                    <label>Nombre</label>

                    {
                        tipo === "admin"

                        ?

                        <input
                            type="text"
                            name="nombre"
                            value={formulario.nombre}
                            onChange={handleChange}
                        />

                        :

                        <p>{informacion?.nombre || 'Sin nombre'}</p>
                    }


                    <label>Correo</label>

                    {
                        tipo === "admin"

                        ?

                        <input
                            type="email"
                            name="correo"
                            value={formulario.correo}
                            onChange={handleChange}
                        />

                        :

                        <p>{informacion?.correo || 'Sin correo registrado'}</p>
                    }


                    <label>Teléfono</label>

                    {
                        tipo === "admin"

                        ?

                        <input
                            type="text"
                            name="telefono"
                            value={formulario.telefono}
                            onChange={handleChange}
                        />

                        :

                        <p>{informacion?.telefono || 'Sin teléfono registrado'}</p>
                    }


                    <label>Slogan</label>

                    {
                        tipo === "admin"

                        ?

                        <input
                            type="text"
                            name="slogan"
                            value={formulario.slogan}
                            onChange={handleChange}
                        />

                        :

                        <p>{informacion?.slogan || 'Sin slogan'}</p>
                    }


                    {
                        tipo === "admin" &&

                        <>
                            <label>Imagen</label>

                            <input
                                type="file"
                                onChange={handleImagen}
                            />

                            <button
                                className="boton-ceo"
                                onClick={guardarInformacion}
                            >
                                {
                                    informacion

                                        ?

                                        'Actualizar información'

                                        :

                                        'Crear información'
                                }
                            </button>
                        </>
                    }

                </div>            

            </div>

        </div>

    );

}

export default DashboardInformacionCeo;