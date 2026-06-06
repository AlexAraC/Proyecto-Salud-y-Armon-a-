import { useEffect, useState } from 'react';

import CardProducto from './CardProducto';

import { obtenerProductos }
from '../services/productosApi';

import './DashboardProductos.css';

function DashboardProductos() {

    const [productos, setProductos] =
        useState([]);

    useEffect(() => {

        const cargarProductos =
            async () => {

                try {

                    const datos =
                        await obtenerProductos();

                    setProductos(datos);

                } catch (error) {

                    console.error(error);

                }

            };

        cargarProductos();

    }, []);

    const productosPorCategoria =
        productos.reduce(

            (grupos, producto) => {

                const categoria =
                    producto.categoria;

                if (!grupos[categoria]) {

                    grupos[categoria] = [];

                }

                grupos[categoria].push(
                    producto
                );

                return grupos;

            },

            {}

        );

    return (

        <div className="dashboard-productos">

            <h1>
                Productos
            </h1>

            {

                Object.entries(
                    productosPorCategoria
                )

                .map(

                    ([categoria, productos]) => (

                        <section
                            key={categoria}
                            className="categoria-bloque"
                        >

                            <h2>
                                {categoria}
                            </h2>

                            <div
                                className="grid-productos"
                            >

                                {

                                    productos.map(

                                        (producto) => (

                                            <CardProducto

                                                key={
                                                    producto.id
                                                }

                                                producto={
                                                    producto
                                                }

                                            />

                                        )

                                    )

                                }

                            </div>

                        </section>

                    )

                )

            }

        </div>

    );

}

export default DashboardProductos;