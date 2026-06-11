import { useEffect, useState } from 'react';

import CardProducto from './CardProducto';

import DashboardInformacionCeo
from './DashboardInformacionCeo';

import  DashboardInformacionInstitucional 
from './DashboardInformacionInstitucional'

import { obtenerDestacados }
from '../services/productosApi';

import './DashboardHomePage.css';

function DashboardHomePage() {

    const [productos, setProductos] =
        useState([]);

    const cargarProductos =
        async () => {

            try {

                const datos =
                    await obtenerDestacados();

                setProductos(datos);

            } catch (error) {

                console.error(error);

            }

        };

    useEffect(() => {

        cargarProductos();

    }, []);

    return (


        <div className="dashboard-home-page">
            <h1>Editor de la Pagina Principal</h1>

            <p className="descripcion-home">

                En esta sección podrás ver los productos que se mostrarán en la página principal. Estos productos serán los primeros en aparecer para los usuarios.

                <br /><br />

                Además, aquí podrás visualizar y administrar la información de la empresa, así como el perfil del propietario o propietaria. También tendrás la posibilidad de modificar estos datos según las necesidades de la compañía.

            </p>

            <h1>

                Productos Destacados

            </h1>

            <div className="grid-productos">

                {

                    productos.map(

                        (producto) => (

                            <CardProducto

                                key={producto.id}

                                producto={producto}

                                tipo="gestionHome"

                            />

                        )

                    )

                }

            </div>


            {/* =====================================
               INFORMACIÓN DEL CEO
            ===================================== */}

            <DashboardInformacionCeo 
            tipo="admin"
            />
            <DashboardInformacionInstitucional
                tipo="admin"
            />

        </div>

    );

}

export default DashboardHomePage;