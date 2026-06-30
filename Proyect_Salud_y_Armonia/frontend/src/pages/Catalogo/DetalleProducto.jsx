import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { obtenerProductoPorId } from '../../services/productosApi';
import { agregarAlCarrito } from '../../services/carritoApi';
import { agregarAlCarritoLocal } from '../../services/carritoLocal';
import { crearComentario } from '../../services/comentariosApi';
import './DetalleProducto.css';

function DetalleProducto() {

    const { id } = useParams();
    const navigate = useNavigate();
    const [producto, setProducto] = useState(null);
    const [cantidad, setCantidad] = useState(1);
    const [cargando, setCargando] = useState(true);
    const [modalReporte, setModalReporte] = useState(false);
    const [mensajeReporte, setMensajeReporte] = useState('');
    const [enviando, setEnviando] = useState(false);

    useEffect(() => {
        const cargar = async () => {
            try {
                const datos = await obtenerProductoPorId(id);
                setProducto(datos);
            } catch (error) {
                console.error(error);
            } finally {
                setCargando(false);
            }
        };
        cargar();
    }, [id]);

    if (cargando) {
        return (
            <div className="detalle-contenedor">
                <div className="detalle-card">
                    <p className="detalle-cargando">Cargando...</p>
                </div>
            </div>
        );
    }

    if (!producto) {
        return (
            <div className="detalle-contenedor">
                <div className="detalle-card detalle-error">
                    <h2>Producto no encontrado</h2>
                    <Link to="/catalogo" className="detalle-btn-volver">
                        ← Volver al catálogo
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="detalle-contenedor">
            <div className="detalle-card anim-card">

                <div className="detalle-grid">

                    <div
                        className="detalle-imagen-contenedor anim-imagen"
                        style={{ animationDelay: '0.1s' }}
                    >
                        <img
                            src={`http://localhost:3000${producto.imagen}`}
                            alt={producto.nombre}
                        />
                    </div>

                    <div className="detalle-info">

                        <span
                            className="detalle-categoria anim-categoria"
                            style={{ animationDelay: '0.2s' }}
                        >
                            {producto.categoria}
                        </span>

                        <h1
                            className="detalle-nombre anim-nombre"
                            style={{ animationDelay: '0.25s' }}
                        >
                            {producto.nombre}
                        </h1>

                        <p
                            className="detalle-precio anim-precio"
                            style={{ animationDelay: '0.3s' }}
                        >
                            ₡{producto.precio}
                        </p>

                        <p
                            className="detalle-descripcion anim-descripcion"
                            style={{ animationDelay: '0.35s' }}
                        >
                            {producto.descripcion}
                        </p>

                        <p
                            className="detalle-stock anim-stock"
                            style={{ animationDelay: '0.4s' }}
                        >
                            Stock disponible:{' '}
                            <span>{producto.stock} unidades</span>
                        </p>

                        <div
                            className="detalle-cantidad anim-cantidad"
                            style={{ animationDelay: '0.45s' }}
                        >
                            <label>Cantidad</label>
                            <input
                                type="number"
                                min="1"
                                max={producto.stock}
                                value={cantidad}
                                onChange={(e) =>
                                    setCantidad(Number(e.target.value))
                                }
                            />
                        </div>

                        <div
                            className="detalle-acciones anim-acciones"
                            style={{ animationDelay: '0.55s' }}
                        >
                            <button className="detalle-btn-carrito" onClick={async () => {
                                const token = localStorage.getItem('token');
                                if (token) {
                                    try {
                                        await agregarAlCarrito(producto.id, cantidad);
                                    } catch (e) {
                                        console.error(e);
                                    }
                                } else {
                                    agregarAlCarritoLocal(producto, cantidad);
                                }
                                navigate('/catalogo?carrito=abierto');
                            }}>
                                Agregar al carrito
                            </button>
                            <Link to="/catalogo" className="detalle-btn-volver">
                                ← Volver al catálogo
                            </Link>
                            <button
                                className="detalle-btn-reportar"
                                title="Reportar error"
                                onClick={() => {
                                    if (!localStorage.getItem('token')) {
                                        navigate('/login');
                                    } else {
                                        setModalReporte(true);
                                    }
                                }}
                            >
                                ⚠
                            </button>
                        </div>

                    </div>

                </div>

            </div>

            {modalReporte && (
                <div className="modal-reporte-overlay" onClick={() => setModalReporte(false)}>
                    <div className="modal-reporte" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-reporte-cerrar" onClick={() => setModalReporte(false)}>✕</button>
                        <h2 className="modal-reporte-titulo">Reportar error</h2>
                        <p className="modal-reporte-sub">Producto: {producto.nombre}</p>
                        {enviando ? (
                            <p className="modal-reporte-enviando">Enviando reporte...</p>
                        ) : (
                            <form className="modal-reporte-form" onSubmit={async (e) => {
                                e.preventDefault();
                                if (!mensajeReporte.trim()) return;
                                setEnviando(true);
                                try {
                                    await crearComentario({ tipo: 'reporte', contenido: mensajeReporte });
                                    setModalReporte(false);
                                    setMensajeReporte('');
                                } catch (err) {
                                    alert(err.response?.data?.mensaje || 'Error al enviar el reporte');
                                } finally {
                                    setEnviando(false);
                                }
                            }}>
                                <label>
                                    ¿Qué ocurrió?
                                    <textarea required rows="4" value={mensajeReporte} onChange={(e) => setMensajeReporte(e.target.value)} placeholder="Describe brevemente el error..." />
                                </label>
                                <button type="submit" className="modal-reporte-enviar">Enviar reporte</button>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );

}

export default DetalleProducto;
