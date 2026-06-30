import { useEffect, useState } from 'react';

import MenuLateral from '../../components/NavLateral';
import DashboardGraficos from '../../components/DashboardGraficos';
import DashboardComentarios from '../../components/DashboardComentarios';
import DashboardCategorias from '../../components/DashboardCategorias';
import DashboardProductos from '../../components/DashboardProductos';
import DashboardHomePage from '../../components/DashboardHomePage';
import DashboardPedidos from '../../components/DashboardPedidos';
import DashboardVentas from '../../components/DashboardVentas';
import DashboardHistorialVentas from '../../components/DashboardHistorialVentas';
import DashboardUsuarios from '../../components/DashboardUsuarios';

import { obtenerEstadisticas } from '../../services/estadisticasService';

import './MenuPrincipal.css';

function MenuPrincipal() {

    const [estadisticas, setEstadisticas] = useState(null);

    const [seccionActiva, setSeccionActiva] = useState('general');

    const [cargando, setCargando] = useState(true);

    useEffect(() => {

        const cargarDatos = async () => {

            try {

                const datos = await obtenerEstadisticas();

                setEstadisticas(datos);

                setCargando(false);

            }

            catch (error) {

                setCargando(false);

                if (error.response?.status === 403) {

                    alert('No tienes permisos de administrador.');

                    localStorage.removeItem('token');

                    window.location.href = '/login';

                }

                else {

                    alert('No se pudieron cargar las estadísticas.');

                }

            }

        };

        cargarDatos();

    }, []);

    if (cargando) {

        return <h2>Cargando...</h2>;

    }

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

                            <h1>Administración General</h1>

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

                {
                    seccionActiva === 'productos' && (

                        <DashboardProductos />

                    )
                }

                {
                    seccionActiva === 'homepage' && (

                        <DashboardHomePage />

                    )
                }

                {
                    seccionActiva === 'ventas' && (

                        <DashboardVentas />

                    )
                }

                {
                    seccionActiva === 'historial' && (

                        <DashboardHistorialVentas />

                    )
                }

                {
                    seccionActiva === 'pedidos' && (

                        <DashboardPedidos />

                    )
                }

                {
                    seccionActiva === 'clientes' && (

                        <DashboardUsuarios />

                    )
                }

            </div>

        </div>

    );

}

export default MenuPrincipal;