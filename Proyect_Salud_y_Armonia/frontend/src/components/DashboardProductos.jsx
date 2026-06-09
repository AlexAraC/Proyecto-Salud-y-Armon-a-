import { useEffect, useState } from 'react';

import CardProducto from './CardProducto';

import ModalCrearProducto
from './ModalCrearProducto';



import './DashboardProductos.css';


import {

    obtenerProductos,
    eliminarProducto,
    actualizarProducto,
    agregarDestacado,
    quitarDestacado

} from '../services/productosApi';

function DashboardProductos() {

    const [productos, setProductos] =
        useState([]);
    const [
    modalCrearAbierto,
    setModalCrearAbierto
] = useState(false);

    const cargarProductos =
        async () => {

            try {

                const datos =
                    await obtenerProductos();

                setProductos(datos);
                console.log(
                    'Productos cargados:',
                    datos
                );

            } catch (error) {

                console.error(error);

            }

        };

    useEffect(() => {

        cargarProductos();

    }, []);

        const handleEliminar =
            async (id) => {

                console.log(
                    'Eliminar producto:',
                    id
                );

                const confirmar =
                    window.confirm(
                        '¿Desea eliminar este producto?'
                    );

                if (!confirmar) return;

                try {

                    await eliminarProducto(id);

                    console.log(
                        'Eliminado correctamente'
                    );

                    await cargarProductos();

                }catch (error) {

                    console.log(
                        'ERROR COMPLETO:',
                        error
                    );

                    console.log(
                        'ERROR RESPONSE:',
                        error.response
                    );

                    console.log(
                        'ERROR DATA:',
                        error.response?.data
                    );

                }

            };
            

            const handleEditar =
                async (
                    id,
                    datosActualizados
                ) => {

                    console.log(
                        'Editar:',
                        id,
                        datosActualizados
                    );

                    try {

                        await actualizarProducto(
                            id,
                            datosActualizados
                        );

                        console.log(
                            'Actualizado correctamente'
                        );

                        await cargarProductos();

                    } catch (error) {

                        console.error(error);

                    }

                };

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

        const handleAgregarDestacado = async (id) => {

            try {

                await agregarDestacado(id);

                await cargarProductos();

            } catch (error) {

                console.error(error);

            }

        };


        const handleQuitarDestacado = async (id) => {

            try {

                await quitarDestacado(id);

                await cargarProductos();

            } catch (error) {

                console.error(error);

            }

        };

    return (

        <div className="dashboard-productos">

            <div className="encabezado-productos">

                <h1>
                    Productos
                </h1>

                <button
                    className="boton-agregar-producto"
                    onClick={() =>
                        setModalCrearAbierto(true)
                    }
                >

                    <span className="boton-agregar-icono">
                        +
                    </span>

                    <span className="boton-agregar-texto">
                        Agregar producto
                    </span>

                </button>

            </div>

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

                                                tipo="admin"

                                                onEliminar={
                                                    handleEliminar
                                                }

                                                onEditar={
                                                    handleEditar
                                                }
                                                onAgregarDestacado={handleAgregarDestacado}

                                                onQuitarDestacado={handleQuitarDestacado}

                                            />

                                        )

                                    )

                                }

                            </div>

                        </section>

                    )

                )

            }
            {modalCrearAbierto && (
                <ModalCrearProducto
                onCerrar={() =>
                setModalCrearAbierto(false)
                }
                 onProductoCreado={
                cargarProductos
                }
                />
            )
            }

        </div>

    );

}

export default DashboardProductos;