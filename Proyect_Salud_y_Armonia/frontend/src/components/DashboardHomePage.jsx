import { useEffect, useState } from 'react';
import CardProducto from './CardProducto';
import DashboardInformacionCeo from './DashboardInformacionCeo';
import DashboardInformacionInstitucional from './DashboardInformacionInstitucional';
import { obtenerDestacados } from '../services/productosApi';
import './DashboardHomePage.css';

function DashboardHomePage() {

    const [productos, setProductos] = useState([]);

    useEffect(() => {

        const cargarProductos = async () => {

            try {

                const datos = await obtenerDestacados();

                setProductos(datos);

            } catch (error) {

                console.error(error);

            }

        };

        void cargarProductos();

    }, []);

    return (

        <div className="dashboard-home-page">

            <h1 className="home-title fade-1">
                Editor de la Página Principal
            </h1>

            <p className="descripcion-home fade-2">

                En esta sección podrás ver los productos que se mostrarán en la página principal. Estos productos serán los primeros en aparecer para los usuarios.

                <br /><br />

                Además, aquí podrás visualizar y administrar la información de la empresa, así como el perfil del propietario o propietaria. También tendrás la posibilidad de modificar estos datos según las necesidades de la compañía.

            </p>

            <h1 className="home-title fade-3">
                Productos Destacados
            </h1>

            <div className="grid-productos fade-4">

                {
                    productos.map((producto, index) => (

                        <div
                            key={producto.id}
                            className="producto-destacado-animado"
                            style={{
                                animationDelay: `${0.75 + (0.08 * index)}s`
                            }}
                        >
                            <CardProducto
                                producto={producto}
                                tipo="gestionHome"
                            />
                        </div>

                    ))
                }

            </div>

            <div className="home-section fade-5">
                <DashboardInformacionCeo
                    tipo="admin"
                />
            </div>

            <div className="home-section fade-6">
                <DashboardInformacionInstitucional
                    tipo="admin"
                />
            </div>

        </div>

    );

}

export default DashboardHomePage;
