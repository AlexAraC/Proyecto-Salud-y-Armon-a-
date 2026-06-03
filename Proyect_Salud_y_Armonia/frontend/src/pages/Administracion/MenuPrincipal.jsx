import { useEffect, useState } from 'react';

import MenuLateral from '../../components/NavLateral';

import DashboardGraficos from '../../components/DashboardGraficos';

import DashboardComentarios from '../../components/DashboardComentarios';

import DashboardCategorias from '../../components/DashboardCategorias';

import { obtenerEstadisticas } from '../../services/estadisticasService';

import './MenuPrincipal.css';

function MenuPrincipal() {

    const [estadisticas, setEstadisticas] = useState(null);

    const [seccionActiva, setSeccionActiva] = useState('general');

    useEffect(() => {

        const cargarDatos = async () => {

            try {

                const datos = await obtenerEstadisticas();

                console.log(datos);

                setEstadisticas(datos);

            }

            catch (error) {

                console.error(error);

            }

        };

        cargarDatos();

    }, []);

    return (

        <div className="panel-admin">

            <MenuLateral
                seccionActiva={seccionActiva}
                cambiarSeccion={setSeccionActiva}
            />

            <div className="contenido-admin">

                {
                    seccionActiva === 'general' && (

                        <>

                            <h1>Administracion General</h1>

                            {
                                estadisticas && (

                                    <DashboardGraficos

                                        ventas={estadisticas.ventas}

                                        productos={estadisticas.productos}

                                    />

                                )
                            }

                            <h1>Comentarios y reportes</h1>

                            <DashboardComentarios />

                        </>

                    )
                }

                {
                    seccionActiva === 'categorias' && (

                        <DashboardCategorias />

                    )
                }

            </div>

        </div>

    );

}

export default MenuPrincipal;
