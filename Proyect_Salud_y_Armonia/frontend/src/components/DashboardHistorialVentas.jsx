import { useEffect, useState } from 'react';

import {
    obtenerPedidosAdmin,
    obtenerPedidoPorId
} from '../services/pedidosApi';

import './DashboardHistorialVentas.css';

function DashboardHistorialVentas() {

    const [pedidos, setPedidos] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [mostrarModal, setMostrarModal] = useState(false);
    const [detallePedido, setDetallePedido] = useState(null);
    const [mostrarModalCliente, setMostrarModalCliente] = useState(false);
    const [clienteInfo, setClienteInfo] = useState(null);

    const esVentaFisica = (pedido) =>
        pedido.usuario === 'Venta Física' ||
        pedido.usuario_correo === 'ventas_fisico@tienda.com';

    const cargarPedidos = async () => {
        try {
            const respuesta = await obtenerPedidosAdmin();
            setPedidos(respuesta.pedidos);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        cargarPedidos();
    }, []);

    const abrirDetalles = async (id) => {
        try {
            const respuesta = await obtenerPedidoPorId(id);
            setDetallePedido(respuesta);
            setMostrarModal(true);
        } catch (error) {
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

    const pedidosFiltrados = busqueda.trim()
        ? pedidos.filter(p =>
            (p.usuario && p.usuario.toLowerCase().includes(busqueda.toLowerCase())) ||
            String(p.id).includes(busqueda)
          )
        : pedidos;

    return (
        <div className="dashboard-pedidos">

            <div className="encabezado-pedidos" style={{ justifyContent: 'space-between' }}>

                <h1 style={{ margin: 0 }}>Historial de Ventas</h1>

                <input
                    className="boton-filtro"
                    type="text"
                    placeholder="Buscar por cliente o ID..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    style={{
                        background: 'white',
                        color: '#3A312B',
                        fontWeight: 600,
                        minWidth: 250,
                        border: '1px solid rgba(58,49,43,.18)',
                        outline: 'none'
                    }}
                />

            </div>

            <div className="contenedor-tabla-pedidos">
                <table className="tabla-pedidos">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Cliente</th>
                            <th>Origen</th>
                            <th>Fecha</th>
                            <th>Total</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pedidosFiltrados.length === 0 && (
                            <tr>
                                <td colSpan={7} style={{ textAlign: 'center', padding: '50px 20px', color: '#999' }}>
                                    No se encontraron ventas
                                </td>
                            </tr>
                        )}
                        {pedidosFiltrados.map(pedido => (
                            <tr key={pedido.id}>
                                <td>{pedido.id}</td>
                                <td>{pedido.usuario}</td>
                                <td>
                                    <span className={`estado ${esVentaFisica(pedido) ? 'Entregado' : 'Enviado'}`}
                                        style={
                                            esVentaFisica(pedido)
                                                ? { background: '#D4EDDA', color: '#155724' }
                                                : { background: '#D1ECF1', color: '#0C5460' }
                                        }
                                    >
                                        {esVentaFisica(pedido) ? 'Físico' : 'En línea'}
                                    </span>
                                </td>
                                <td>{new Date(pedido.fecha).toLocaleDateString()}</td>
                                <td>₡{pedido.total}</td>
                                <td>
                                    <span className={`estado ${pedido.estado}`}>
                                        {pedido.estado}
                                    </span>
                                </td>
                                <td>
                                    <button
                                        className="btn-detalles"
                                        onClick={() => abrirDetalles(pedido.id)}
                                    >
                                        Ver detalles
                                    </button>
                                    <button
                                        className="btn-cliente"
                                        onClick={() => abrirInfoCliente(pedido)}
                                    >
                                        Ver cliente
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {mostrarModal && detallePedido && (
                <div
                    className="modal-fondo"
                    onClick={() => setMostrarModal(false)}
                >
                    <div
                        className="modal-detalles"
                        onClick={e => e.stopPropagation()}
                    >
                        <h2>Pedido #{detallePedido.pedido.id}</h2>

                        <p>
                            <strong>Estado:</strong>{' '}
                            {detallePedido.pedido.estado}
                        </p>
                        <p>
                            <strong>Origen:</strong>{' '}
                            {detallePedido.pedido.usuario === 'Venta Física'
                                ? 'Físico'
                                : 'En línea'}
                        </p>
                        <p>
                            <strong>Tipo de envío:</strong>{' '}
                            {detallePedido.pedido.tipo_envio || 'Normal'}
                        </p>
                        <p>
                            <strong>Método de pago:</strong>{' '}
                            {detallePedido.pedido.metodo_pago}
                        </p>

                        <p className="total-pagar">
                            <strong>Total a pagar:</strong>{' '}
                            ₡{detallePedido.pedido.total}
                        </p>

                        <h3>Productos</h3>

                        {detallePedido.productos.map(producto => (
                            <div
                                className="producto-detalle"
                                key={producto.nombre_producto}
                            >
                                <p><strong>{producto.nombre_producto}</strong></p>
                                <p>Cantidad: {producto.cantidad}</p>
                                <p>Subtotal: ₡{producto.subtotal}</p>
                                <hr />
                            </div>
                        ))}

                        <button
                            className="btn-cerrar"
                            onClick={() => setMostrarModal(false)}
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}

            {mostrarModalCliente && clienteInfo && (
                <div
                    className="modal-fondo"
                    onClick={() => setMostrarModalCliente(false)}
                >
                    <div
                        className="modal-detalles"
                        onClick={e => e.stopPropagation()}
                    >
                        <h2>Información del Cliente</h2>
                        <p><strong>Nombre:</strong> {clienteInfo.nombre}</p>
                        <p><strong>Correo:</strong> {clienteInfo.correo || 'No registrado'}</p>
                        <p><strong>Teléfono:</strong> {clienteInfo.telefono || 'No registrado'}</p>
                        <p><strong>Dirección:</strong> {clienteInfo.direccion || 'No registrada'}</p>
                        <button
                            className="btn-cerrar"
                            onClick={() => setMostrarModalCliente(false)}
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
}

export default DashboardHistorialVentas;
