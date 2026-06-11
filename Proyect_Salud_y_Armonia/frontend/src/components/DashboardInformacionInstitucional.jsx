import { useEffect, useState } from 'react';

import {

    obtenerInformacionInstitucional,
    crearInformacionInstitucional,
    actualizarInformacionInstitucional

}

from '../services/informacionInstitucionalApi';

import './DashboardInformacionInstitucional.css';

function DashboardInformacionInstitucional({ tipo }) {

    const [informacion, setInformacion] =
        useState(null);

    const [formulario, setFormulario] =
        useState({

            slogan: '',
            descripcion: '',
            telefono: '',
            correo: '',
            imagen: null

        });


    // =====================================
    // CARGAR INFORMACIÓN
    // =====================================

    const cargarInformacion = async () => {

        try {

            const respuesta =
                await obtenerInformacionInstitucional();

            if (

                respuesta.informacion.length > 0

            ) {

                const empresa =
                    respuesta.informacion[0];

                setInformacion(
                    empresa
                );

                setFormulario({

                    slogan:
                        empresa.slogan,

                    descripcion:
                        empresa.descripcion,

                    telefono:
                        empresa.telefono,

                    correo:
                        empresa.correo,

                    imagen: null

                });

            }

        }

        catch (error) {

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
    // IMAGEN
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

    const guardarInformacion = async () => {

        try {

            if (informacion) {

                await actualizarInformacionInstitucional(

                    informacion.id,

                    formulario

                );

            }

            else {

                await crearInformacionInstitucional(

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
            className="dashboard-institucional"
        >

            <h1>

                Información de la Empresa

            </h1>

            <div
                className="contenedor-institucional"
            >

                <img

                    className="foto-empresa"

                    src={

                        informacion?.imagen

                            ?

                            `http://localhost:3000${informacion.imagen}`

                            :

                            'http://localhost:3000/uploads/empresa.png'

                    }

                    alt="Empresa"

                />


                <div
                    className="formulario-institucional"
                >

                    <label>

                        Slogan

                    </label>

                    {

                        tipo === "admin"

                        ?

                        <input

                            type="text"

                            name="slogan"

                            value={
                                formulario.slogan
                            }

                            onChange={
                                handleChange
                            }

                        />

                        :

                        <p>

                            {

                                informacion?.slogan ||

                                'Sin slogan'

                            }

                        </p>

                    }


                    <label>

                        Descripción

                    </label>

                    {

                        tipo === "admin"

                        ?

                        <textarea

                            name="descripcion"

                            value={
                                formulario.descripcion
                            }

                            onChange={
                                handleChange
                            }

                        />

                        :

                        <p>

                            {

                                informacion?.descripcion ||

                                'Sin descripción'

                            }

                        </p>

                    }


                    <label>

                        Teléfono

                    </label>

                    {

                        tipo === "admin"

                        ?

                        <input

                            type="text"

                            name="telefono"

                            value={
                                formulario.telefono
                            }

                            onChange={
                                handleChange
                            }

                        />

                        :

                        <p>

                            {

                                informacion?.telefono ||

                                'Sin teléfono registrado'

                            }

                        </p>

                    }


                    <label>

                        Correo

                    </label>

                    {

                        tipo === "admin"

                        ?

                        <input

                            type="email"

                            name="correo"

                            value={
                                formulario.correo
                            }

                            onChange={
                                handleChange
                            }

                        />

                        :

                        <p>

                            {

                                informacion?.correo ||

                                'Sin correo registrado'

                            }

                        </p>

                    }


                    {

                        tipo === "admin" && (

                            <>

                                <label>

                                    Imagen

                                </label>

                                <input

                                    type="file"

                                    onChange={
                                        handleImagen
                                    }

                                />

                                <button

                                    className="boton-institucional"

                                    onClick={
                                        guardarInformacion
                                    }

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

                        )

                    }

                </div>

            </div>

        </div>

    );

}

export default DashboardInformacionInstitucional;