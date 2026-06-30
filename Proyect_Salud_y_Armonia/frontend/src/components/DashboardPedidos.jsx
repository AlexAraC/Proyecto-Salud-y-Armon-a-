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

    const [mostrarModalCliente, setMostrarModalCliente] = useState(false);

    const [clienteInfo, setClienteInfo] = useState(null);


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


    useEffect(() => {

        const cargarPedidosIniciales = async () => {

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

        void cargarPedidosIniciales();

    }, []);


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


    const abrirInfoCliente = (pedido) => {

        setClienteInfo({

            nombre: pedido.usuario,

            correo: pedido.usuario_correo,

            telefono: pedido.usuario_telefono,

            direccion: pedido.usuario_direccion

        });

        setMostrarModalCliente(true);

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


    const pedidosFiltrados = [...(filtro === 'Todos' ? pedidos : pedidos.filter(
        pedido => pedido.estado === filtro
    ))].sort((a, b) => {
        if (a.estado === 'Pendiente' && b.estado !== 'Pendiente') return -1;
        if (a.estado !== 'Pendiente' && b.estado === 'Pendiente') return 1;
        return 0;
    });


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

        <div className="contenedor-tabla-pedidos">
            <table className="tabla-pedidos">

                <thead>

                    <tr>

                        <th>ID</th>

                        <th>Cliente</th>

                        <th>Fecha</th>

                        <th>Total</th>

                        <th>Estado</th>

                        <th>Tipo Envío</th>

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

                                        {pedido.usuario}

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

                                        <span

                                            className={

                                                `tipo-envio ${pedido.tipo_envio || 'Normal'}`

                                            }

                                        >

                                            {

                                                pedido.tipo_envio || 'Normal'

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

                                        <button

                                            className="btn-cliente"

                                            onClick={() =>

                                                abrirInfoCliente(

                                                    pedido
                                                )
                                            }
                                        >

                                            Ver cliente

                                        </button>


                                        {

                                            pedido.estado === 'Pendiente' && pedido.tipo_envio === 'Express'

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

                                            pedido.estado === 'Pendiente' && pedido.tipo_envio !== 'Express'

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

                                            pedido.estado === 'Entregado' && pedido.tipo_envio === 'Express'

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


                                        {

                                            pedido.estado === 'Entregado' && pedido.tipo_envio !== 'Express'

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

                                    </td>

                                </tr>

                            )

                        )

                    }

                </tbody>

            </table>
        </div>
        


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

                            Tipo de envío:

                            {' '}

                            {

                                detallePedido.pedido.tipo_envio || 'Normal'

                            }

                        </p>

                        <p>

                            Método de pago:

                            {' '}

                            {

                                detallePedido.pedido.metodo_pago

                            }

                        </p>


                        <p className="total-pagar">

                            <strong>Total a pagar:</strong>

                            {' '}

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
                                      className="producto-detalle"

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

            {

                mostrarModalCliente

                &&

                clienteInfo

                &&

                <div

                    className="modal-fondo"

                    onClick={() =>

                        setMostrarModalCliente(false)
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

                            Información del Cliente

                        </h2>

                        <p>

                            <strong>Nombre:</strong>

                            {' '}

                            {clienteInfo.nombre}

                        </p>

                        <p>

                            <strong>Correo:</strong>

                            {' '}

                            {clienteInfo.correo || 'No registrado'}

                        </p>

                        <p>

                            <strong>Teléfono:</strong>

                            {' '}

                            {clienteInfo.telefono || 'No registrado'}

                        </p>

                        <p>

                            <strong>Dirección:</strong>

                            {' '}

                            {clienteInfo.direccion || 'No registrada'}

                        </p>

                        <button

                            className="btn-cerrar"

                            onClick={() =>

                                setMostrarModalCliente(

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
