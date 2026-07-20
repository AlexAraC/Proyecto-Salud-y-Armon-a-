import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    obtenerCarrito,
    agregarAlCarrito,
    checkoutCarrito
} from '../../services/carritoApi';
import {
    obtenerCarritoLocal,
    vaciarCarritoLocal
} from '../../services/carritoLocal';
import './ConfirmarPedido.css';

function ConfirmarPedido() {

    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [metodoPago, setMetodoPago] = useState('Efectivo');
    const [tipoEnvio, setTipoEnvio] = useState('Normal');
    const [direccionEnvio, setDireccionEnvio] = useState('');
    const [usarOtraDireccion, setUsarOtraDireccion] = useState(false);
    const [cargando, setCargando] = useState(true);
    const [confirmando, setConfirmando] = useState(false);
    const [warningTarjeta, setWarningTarjeta] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/register');
            return;
        }
        iniciar();
    }, [navigate]);

    const iniciar = async () => {
        try {
            const locales = obtenerCarritoLocal();
            if (locales.length > 0) {
                for (const item of locales) {
                    await agregarAlCarrito(item.producto_id, item.cantidad);
                }
                vaciarCarritoLocal();
            }
            const data = await obtenerCarrito();
            if (data.carrito && Array.isArray(data.carrito)) {
                setItems(data.carrito);
                const t = data.carrito.reduce(
                    (acc, i) => acc + Number(i.subtotal), 0
                );
                setTotal(data.total || t);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setCargando(false);
        }
    };

    const handleConfirmar = async () => {
        setConfirmando(true);
        try {
            const datos = {
                metodo_pago: metodoPago,
                tipo_envio: tipoEnvio
            };
            if (tipoEnvio === 'Express' && usarOtraDireccion && direccionEnvio.trim()) {
                datos.direccion_envio = direccionEnvio.trim();
            }
            await checkoutCarrito(datos);
            alert('Pedido realizado correctamente');
            navigate('/catalogo');
        } catch (error) {
            console.error(error);
            alert('Error al realizar el pedido');
        } finally {
            setConfirmando(false);
        }
    };

    if (cargando) {
        return (
            <div className="confirmar-cargando">
                Cargando pedido...
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="confirmar-vacio">
                <h2>No hay productos en el carrito</h2>
                <button
                    className="confirmar-volver"
                    onClick={() => navigate('/catalogo')}
                >
                    Volver al catálogo
                </button>
            </div>
        );
    }

    return (
        <div className="confirmar-contenedor">
            <div className="confirmar-card">
                <h1 className="confirmar-titulo">Confirmar Pedido</h1>
                <div className="confirmar-items">
                    {items.map((item) => (
                        <div key={item.detalle_id} className="confirmar-item">
                            <div className="confirmar-item-info">
                                <p className="confirmar-item-nombre">
                                    {item.nombre}
                                </p>
                                <p className="confirmar-item-precio">
                                    ₡{item.precio} x {item.cantidad}
                                </p>
                            </div>
                            <p className="confirmar-item-subtotal">
                                ₡{Number(item.subtotal).toFixed(2)}
                            </p>
                        </div>
                    ))}
                </div>
                <div className="confirmar-total">
                    <span>Total</span>
                    <span className="confirmar-total-monto">
                        ₡{Number(total).toFixed(2)}
                    </span>
                </div>
                <div className="confirmar-pago">
                    <label htmlFor="metodo-pago">
                        Método de pago
                    </label>
                    <select
                        id="metodo-pago"
                        value={metodoPago}
                        onChange={(e) => setMetodoPago(e.target.value)}
                        className="confirmar-select"
                    >
                        <option value="Efectivo">Efectivo</option>
                        {tipoEnvio !== 'Express' && <option value="Tarjeta">Tarjeta</option>}
                        <option value="Sinpe Móvil">Sinpe Móvil</option>
                    </select>
                    {warningTarjeta && (
                        <p className="confirmar-tarjeta-warning">
                            Si es express no es posible realizar la compra con tarjeta
                        </p>
                    )}
                </div>
                <div className="confirmar-envio">

                    <label className="confirmar-envio-label">
                        Tipo de envío
                    </label>

                    <div className="confirmar-envio-opciones">

                        <label className={`confirmar-envio-option ${tipoEnvio === 'Normal' ? 'activo' : ''}`}>
                            <input
                                type="radio"
                                name="tipo-envio"
                                value="Normal"
                                checked={tipoEnvio === 'Normal'}
                                onChange={() => {
                                    setTipoEnvio('Normal');
                                    setUsarOtraDireccion(false);
                                    setDireccionEnvio('');
                                    setWarningTarjeta(false);
                                }}
                            />
                            Normal
                        </label>

                        <label className={`confirmar-envio-option ${tipoEnvio === 'Express' ? 'activo' : ''}`}>
                            <input
                                type="radio"
                                name="tipo-envio"
                                value="Express"
                                checked={tipoEnvio === 'Express'}
                                onChange={() => {
                                    setTipoEnvio('Express');
                                    if (metodoPago === 'Tarjeta') {
                                        setMetodoPago('Efectivo');
                                        setWarningTarjeta(true);
                                        setTimeout(() => setWarningTarjeta(false), 5000);
                                    }
                                }}
                            />
                            Express
                        </label>

                    </div>

                    {tipoEnvio === 'Express' && (

                        <div className="confirmar-direccion">

                            <p className="confirmar-envio-warning">
                                Los express se hacen a áreas circunvecinas a Florencia, Santa Clara y alrededores
                            </p>

                            <label className="confirmar-checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={usarOtraDireccion}
                                    onChange={(e) =>
                                        setUsarOtraDireccion(e.target.checked)
                                    }
                                />
                                Usar otra dirección
                            </label>

                            {usarOtraDireccion ? (

                                <input
                                    className="confirmar-input-direccion"
                                    type="text"
                                    placeholder="Escribe tu dirección"
                                    value={direccionEnvio}
                                    onChange={(e) =>
                                        setDireccionEnvio(e.target.value)
                                    }
                                />

                            ) : (

                                <p className="confirmar-perfil-direccion">
                                    Se usará la dirección asignada en tu perfil
                                </p>

                            )}

                        </div>

                    )}

                </div>
                {tipoEnvio === 'Normal' && (

                <p className="confirmar-normal-warning">
                    El pedido debe ser recogido en la dirección del local, ubicada en la página principal.
                </p>

                )}

                <div className="confirmar-acciones">
                    <button
                        className="confirmar-atras"
                        onClick={() => navigate('/catalogo')}
                    >
                        Seguir comprando
                    </button>
                    <button
                        className="confirmar-btn"
                        onClick={handleConfirmar}
                        disabled={confirmando}
                    >
                        {confirmando
                            ? 'Procesando...'
                            : 'Confirmar pedido'
                        }
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmarPedido;
