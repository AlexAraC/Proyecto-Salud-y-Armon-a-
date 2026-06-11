import { useEffect, useState } from 'react';

import {
    obtenerPedidosAdmin,
    actualizarEstadoPedido,
    obtenerPedidoPorId
} from '../services/pedidosApi';

import './DashboardPedidos.css';

function DashboardPedidos() {

    const [pedidos, setPedidos] = useState([]);

    const [filtro, setFiltro] = useState('Todos');

    const [mostrarFiltro, setMostrarFiltro] = useState(false);

    const [mostrarModal, setMostrarModal] = useState(false);

    const [detallePedido, setDetallePedido] = useState(null);


    useEffect(() => {

        cargarPedidos();

    }, []);


    const cargarPedidos = async () => {

        try {

            const respuesta = await obtenerPedidosAdmin();

            setPedidos(
                respuesta.pedidos
            );

        }

        catch (error) {

            console.log(error);

        }

    };


    const abrirDetalles = async (id) => {

        try {

            const respuesta = await obtenerPedidoPorId(id);

            setDetallePedido(respuesta);

            setMostrarModal(true);

        }

        catch (error) {

            console.log(error);

        }

    };


    const cambiarEstado = async (

        id,

        estado

    ) => {

        try {

            await actualizarEstadoPedido(

                id,

                estado

            );

            cargarPedidos();

        }

        catch (error) {

            console.log(error);

        }

    };


    const pedidosFiltrados =

        filtro === 'Todos'

            ?

            pedidos

            :

            pedidos.filter(

                pedido =>

                    pedido.estado === filtro

            );


    return (

        <div className="dashboard-pedidos">

            <div className="encabezado-pedidos">

                <button

                    className="boton-filtro"

                    onClick={() =>

                        setMostrarFiltro(

                            !mostrarFiltro

                        )

                    }

                >

                    Filtrar por estado

                </button>


                {

                    mostrarFiltro &&

                    <div className="menu-filtro">

                        <button
                            onClick={() => setFiltro('Todos')}
                        >
                            Todos
                        </button>

                        <button
                            onClick={() => setFiltro('Pendiente')}
                        >
                            Pendiente
                        </button>

                        <button
                            onClick={() => setFiltro('Enviado')}
                        >
                            Enviado
                        </button>

                        <button
                            onClick={() => setFiltro('Entregado')}
                        >
                            Entregado
                        </button>

                        <button
                            onClick={() => setFiltro('Cancelado')}
                        >
                            Cancelado
                        </button>

                    </div>

                }

            </div>


            <table className="tabla-pedidos">

                <thead>

                    <tr>

                        <th>ID</th>

                        <th>Cliente</th>

                        <th>Fecha</th>

                        <th>Total</th>

                        <th>Estado</th>

                        <th>Acciones</th>

                    </tr>

                </thead>

                <tbody>

                    {

                        pedidosFiltrados.map(

                            pedido => (

                                <tr key={pedido.id}>

                                    <td>

                                        {pedido.id}

                                    </td>

                                    <td>

                                        {pedido.nombre_usuario}

                                    </td>

                                    <td>

                                        {

                                            new Date(

                                                pedido.fecha

                                            ).toLocaleDateString()

                                        }

                                    </td>

                                    <td>

                                        ₡{pedido.total}

                                    </td>

                                    <td>

                                        <span

                                            className={

                                                `estado ${pedido.estado}`

                                            }

                                        >

                                            {

                                                pedido.estado

                                            }

                                        </span>

                                    </td>

                                    <td>

                                        <button

                                            className="btn-detalles"

                                            onClick={() =>

                                                abrirDetalles(

                                                    pedido.id

                                                )

                                            }

                                        >

                                            Ver detalles

                                        </button>


                                        {

                                            pedido.estado === 'Pendiente'

                                            &&

                                            <button

                                                className="btn-enviar"

                                                onClick={() =>

                                                    cambiarEstado(

                                                        pedido.id,

                                                        'Enviado'

                                                    )

                                                }

                                            >

                                                Enviar

                                            </button>

                                        }


                                        {

                                            pedido.estado === 'Enviado'

                                            &&

                                            <button

                                                className="btn-entregar"

                                                onClick={() =>

                                                    cambiarEstado(

                                                        pedido.id,

                                                        'Entregado'

                                                    )

                                                }

                                            >

                                                Entregar

                                            </button>

                                        }


                                        {

                                            pedido.estado === 'Enviado'

                                            &&

                                            <button

                                                className="btn-atras"

                                                onClick={() =>

                                                    cambiarEstado(

                                                        pedido.id,

                                                        'Pendiente'

                                                    )

                                                }

                                            >

                                                Volver

                                            </button>

                                        }


                                        {

                                            pedido.estado === 'Entregado'

                                            &&

                                            <button

                                                className="btn-atras"

                                                onClick={() =>

                                                    cambiarEstado(

                                                        pedido.id,

                                                        'Enviado'

                                                    )

                                                }

                                            >

                                                Volver

                                            </button>

                                        }

                                    </td>

                                </tr>

                            )

                        )

                    }

                </tbody>

            </table>


            {

                mostrarModal

                &&

                detallePedido

                &&

                <div

                    className="modal-fondo"

                    onClick={() =>

                        setMostrarModal(false)

                    }

                >

                    <div

                        className="modal-detalles"

                        onClick={

                            e =>

                                e.stopPropagation()

                        }

                    >

                        <h2>

                            Pedido #

                            {

                                detallePedido.pedido.id

                            }

                        </h2>


                        <p>

                            Estado:

                            {' '}

                            {

                                detallePedido.pedido.estado

                            }

                        </p>


                        <p>

                            Método de pago:

                            {' '}

                            {

                                detallePedido.pedido.metodo_pago

                            }

                        </p>


                        <p>

                            Total:

                            ₡

                            {

                                detallePedido.pedido.total

                            }

                        </p>


                        <h3>

                            Productos

                        </h3>


                        {

                            detallePedido.productos.map(

                                producto => (

                                    <div

                                        key={producto.nombre_producto}

                                    >

                                        <p>

                                            {

                                                producto.nombre_producto

                                            }

                                        </p>

                                        <p>

                                            Cantidad:

                                            {' '}

                                            {

                                                producto.cantidad

                                            }

                                        </p>

                                        <p>

                                            Subtotal:

                                            ₡

                                            {

                                                producto.subtotal

                                            }

                                        </p>

                                        <hr />

                                    </div>

                                )

                            )

                        }


                        <button

                            className="btn-cerrar"

                            onClick={() =>

                                setMostrarModal(

                                    false

                                )

                            }

                        >

                            Cerrar

                        </button>

                    </div>

                </div>

            }

        </div>

    );

}

export default DashboardPedidos;