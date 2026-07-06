import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { obtenerMiPerfil, actualizarUsuario } from '../../services/usuariosApi';
import { obtenerPedidosCliente, obtenerPedidoPorId, cancelarPedido } from '../../services/pedidosApi';
import './Perfil.css';

function Perfil() {

    const navigate = useNavigate();

    const [usuario, setUsuario] = useState(null);
    const [pedidos, setPedidos] = useState([]);
    const [historialOrden, setHistorialOrden] = useState('asc');
    const [detallesPedido, setDetallesPedido] = useState({});
    const [pedidoAbierto, setPedidoAbierto] = useState({});
    const [editando, setEditando] = useState(false);
    const [form, setForm] = useState({});
    const [mensaje, setMensaje] = useState('');
    const [cancelando, setCancelando] = useState(null);

    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
            const perfil = await obtenerMiPerfil();
            setUsuario(perfil);
            setForm({
                nombre: perfil.nombre || '',
                correo: perfil.correo || '',
                telefono: perfil.telefono || '',
                direccion: perfil.direccion || ''
            });
        } catch {
            navigate('/login');
        }
        try {
            const data = await obtenerPedidosCliente();
            if (data.pedidos) {
                setPedidos(data.pedidos);
            }
        } catch {}
    };

    const handleCambio = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const toggleDetalles = async (id) => {
        if (pedidoAbierto[id]) {
            setPedidoAbierto((prev) => ({ ...prev, [id]: false }));
            return;
        }
        if (detallesPedido[id]) {
            setPedidoAbierto((prev) => ({ ...prev, [id]: true }));
            return;
        }
        try {
            const data = await obtenerPedidoPorId(id);
            setDetallesPedido((prev) => ({ ...prev, [id]: data }));
            setPedidoAbierto((prev) => ({ ...prev, [id]: true }));
        } catch {}
    };

    const handleCancelarPedido = async (id) => {
        if (!window.confirm('¿Estás seguro de que deseas cancelar este pedido?')) return;
        setCancelando(id);
        try {
            await cancelarPedido(id);
            const data = await obtenerPedidosCliente();
            if (data.pedidos) setPedidos(data.pedidos);
            setMensaje('Pedido cancelado correctamente');
            setTimeout(() => setMensaje(''), 3000);
        } catch (err) {
            setMensaje(err.response?.data?.mensaje || 'Error al cancelar el pedido');
            setTimeout(() => setMensaje(''), 3000);
        } finally {
            setCancelando(null);
        }
    };

    const handleGuardar = async () => {
        setMensaje('');
        try {
            await actualizarUsuario(usuario.id, form);
            setMensaje('Información actualizada correctamente');
            setEditando(false);
            const perfil = await obtenerMiPerfil();
            setUsuario(perfil);
            setForm({
                nombre: perfil.nombre || '',
                correo: perfil.correo || '',
                telefono: perfil.telefono || '',
                direccion: perfil.direccion || ''
            });
        } catch (error) {
            setMensaje('Error al actualizar');
        }
    };

    const formatearFecha = (fecha) => {
        return new Date(fecha).toLocaleDateString('es-CR', {
            year: 'numeric', month: 'long', day: 'numeric'
        });
    };

    const pedidosCrono = [...pedidos].reverse();

    if (!usuario) return <div className="perfil-loading">Cargando...</div>;

    return (
        <div className="perfil">

            {usuario.rol === 'admin' && (
                <div className="perfil-admin-badge">Administrador</div>
            )}

            {usuario.baneado && (
                <div className="perfil-ban">
                    <strong>Cuenta suspendida</strong>
                    {usuario.motivo_ban && <p>{usuario.motivo_ban}</p>}
                </div>
            )}

            {mensaje && <div className="perfil-mensaje">{mensaje}</div>}

            <div className="perfil-aviso">Esta información será utilizada para comunicarnos con usted y, de ser necesario, realizar pedidos express.</div>

            <div className="perfil-contenedor">
                <h2 className="perfil-subtitulo">Información personal</h2>
                {!editando ? (
                    <div className="perfil-info">
                        <label>Nombre
                            <input value={usuario.nombre} disabled />
                        </label>
                        <label>Correo
                            <input value={usuario.correo} disabled />
                        </label>
                        <label>Teléfono
                            <input value={usuario.telefono || 'No registrado'} disabled />
                        </label>
                        <label>Dirección
                            <textarea value={usuario.direccion || 'No registrada'} disabled />
                        </label>
                        <button className="perfil-btn" onClick={() => setEditando(true)}>Editar información</button>
                    </div>
                ) : (
                    <div className="perfil-editar">
                        <label>Nombre
                            <input name="nombre" value={form.nombre} onChange={handleCambio} />
                        </label>
                        <label>Correo
                            <input name="correo" value={form.correo} onChange={handleCambio} />
                        </label>
                        <label>Teléfono
                            <input name="telefono" value={form.telefono} onChange={handleCambio} />
                        </label>
                        <label>Dirección
                            <textarea name="direccion" value={form.direccion} onChange={handleCambio} />
                        </label>
                        <div className="perfil-editar-btns">
                            <button className="perfil-btn" onClick={handleGuardar}>Guardar</button>
                            <button className="perfil-btn perfil-btn-secondary" onClick={() => setEditando(false)}>Cancelar</button>
                        </div>
                    </div>
                )}
            </div>

            <div className="perfil-contenedor">
                <h2 className="perfil-subtitulo">Historial de pedidos</h2>
                {pedidos.length === 0 ? (
                    <p className="perfil-sin-pedidos">No has realizado ningún pedido aún.</p>
                ) : (
                    <>
                    {pedidos.some((p) => p.estado?.toLowerCase() === 'pendiente') && (
                        <div className="perfil-mensaje-pendiente">Gracias por comprar en Salud y Armonía Web, el administrador se comunicará con usted cuando el pedido esté listo.</div>
                    )}
                    <button className="perfil-orden-btn" onClick={() => setHistorialOrden(historialOrden === 'asc' ? 'desc' : 'asc')} title={historialOrden === 'asc' ? 'Más antiguos primero' : 'Más recientes primero'}>
                        {historialOrden === 'asc' ? 'Ordenar: más recientes' : 'Ordenar: más antiguos'}
                    </button>
                    <div className="perfil-pedidos">
                        {(historialOrden === 'asc' ? [...pedidos].reverse() : pedidos).map((p) => (
                            <div key={p.id} className="perfil-pedido">
                                <div className="perfil-pedido-header">
                                    <span className="perfil-pedido-id">Pedido {pedidosCrono.indexOf(p) + 1}</span>
                                    <span className={`perfil-pedido-estado perfil-pedido-estado--${p.estado?.toLowerCase().replace(/\s+/g, '-')}`}>{p.estado}</span>
                                </div>
                                <div className="perfil-pedido-body">
                                    <p><strong>Fecha:</strong> {formatearFecha(p.fecha)}</p>
                                    <p><strong>Total:</strong> ₡{Number(p.total).toLocaleString('es-CR')}</p>
                                    <p><strong>Método de pago:</strong> {p.metodo_pago}</p>
                                    <p><strong>Envío:</strong> {p.tipo_envio}</p>
                                </div>
                                <div className="perfil-pedido-acciones">
                                    <button className="perfil-pedido-btn" onClick={() => toggleDetalles(p.id)}>
                                        {pedidoAbierto[p.id] ? 'Ocultar detalles' : 'Ver detalles'}
                                    </button>
                                    {p.estado !== 'Entregado' && p.estado !== 'Cancelado' && p.estado !== 'Listo para recoger' && (
                                        <button
                                            className="perfil-pedido-btn-cancelar"
                                            onClick={() => handleCancelarPedido(p.id)}
                                            disabled={cancelando === p.id}
                                        >
                                            {cancelando === p.id ? 'Cancelando...' : 'Cancelar pedido'}
                                        </button>
                                    )}
                                </div>
                                {detallesPedido[p.id] && (
                                    <div className={`perfil-pedido-detalles ${pedidoAbierto[p.id] ? 'abierto' : ''}`}>
                                        <div className="perfil-pedido-detalles-inner">
                                            <p className="perfil-pedido-detalles-titulo">Productos</p>
                                            {detallesPedido[p.id].productos?.map((prod, i) => (
                                                <div key={i} className="perfil-pedido-producto">
                                                    <span className="perfil-pedido-producto-nombre">{prod.nombre_producto}</span>
                                                    <span className="perfil-pedido-producto-cant">x{prod.cantidad}</span>
                                                    <span className="perfil-pedido-producto-subtotal">₡{Number(prod.subtotal).toLocaleString('es-CR')}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    </>
                )}
            </div>

        </div>
    );
}

export default Perfil;
