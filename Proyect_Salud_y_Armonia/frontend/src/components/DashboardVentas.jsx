import { useEffect, useState, useRef } from 'react';

import { obtenerProductos } from '../services/productosApi';
import { registrarVenta } from '../services/ventasApi';

import './DashboardVentas.css';

const METODOS_PAGO = [
    'Efectivo',
    'Tarjeta',
    'Sinpe Móvil',
    'Transferencia',
    'Otro'
];

function DashboardVentas() {

    const [productos, setProductos] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [mostrarDrop, setMostrarDrop] = useState(false);
    const [carrito, setCarrito] = useState([]);
    const [metodoPago, setMetodoPago] = useState('Efectivo');
    const [exito, setExito] = useState(null);
    const [enviando, setEnviando] = useState(false);
    const inputRef = useRef(null);
    const dropRef = useRef(null);

    useEffect(() => {
        const cargar = async () => {
            try {
                const data = await obtenerProductos();
                setProductos(data);
            } catch (error) {
                console.log(error);
            }
        };
        cargar();
    }, []);

    useEffect(() => {
        const cerrar = (e) => {
            if (
                dropRef.current &&
                !dropRef.current.contains(e.target) &&
                inputRef.current &&
                !inputRef.current.contains(e.target)
            ) {
                setMostrarDrop(false);
            }
        };
        document.addEventListener('mousedown', cerrar);
        return () => document.removeEventListener('mousedown', cerrar);
    }, []);

    const productosFiltrados = busqueda.trim()
        ? productos.filter(p =>
            p.nombre.toLowerCase().includes(busqueda.toLowerCase())
          )
        : productos;

    const agregarAlCarrito = (producto) => {
        setCarrito(prev => {
            const existe = prev.find(p => p.id === producto.id);
            if (existe) {
                return prev.map(p =>
                    p.id === producto.id
                        ? { ...p, cantidad: p.cantidad + 1 }
                        : p
                );
            }
            return [
                ...prev,
                {
                    id: producto.id,
                    nombre: producto.nombre,
                    precio: producto.precio,
                    stock: producto.stock,
                    cantidad: 1
                }
            ];
        });
        setBusqueda('');
        setMostrarDrop(false);
        inputRef.current?.focus();
    };

    const cambiarCantidad = (id, cantidad) => {
        if (cantidad <= 0) {
            setCarrito(prev => prev.filter(p => p.id !== id));
            return;
        }
        const prod = productos.find(p => p.id === id);
        const max = prod ? prod.stock : 999;
        setCarrito(prev =>
            prev.map(p =>
                p.id === id
                    ? { ...p, cantidad: Math.min(cantidad, max) }
                    : p
            )
        );
    };

    const eliminarDelCarrito = (id) => {
        setCarrito(prev => prev.filter(p => p.id !== id));
    };

    const total = carrito.reduce(
        (sum, p) => sum + p.precio * p.cantidad,
        0
    );

    const handleRegistrar = async () => {
        if (carrito.length === 0) return;

        setEnviando(true);
        setExito(null);

        try {
            const resultado = await registrarVenta({
                productos: carrito.map(p => ({
                    producto_id: p.id,
                    cantidad: p.cantidad
                })),
                metodo_pago: metodoPago
            });

            setExito({
                tipo: 'ok',
                mensaje: `Venta #${resultado.pedidoId} registrada — Total: ₡${resultado.total}`
            });

            setCarrito([]);
            setMetodoPago('Efectivo');

        } catch (error) {
            const msg = error.response?.data?.mensaje || 'Error al registrar la venta';
            setExito({ tipo: 'error', mensaje: msg });
        } finally {
            setEnviando(false);
        }
    };

    return (
        <div className="dashboard-ventas">
            <h1>Registrar Venta Física</h1>

            {exito && (
                <div className={`ventas-alerta ventas-alerta--${exito.tipo}`}>
                    {exito.mensaje}
                    <button onClick={() => setExito(null)}>×</button>
                </div>
            )}

            <div className="ventas-buscador" ref={dropRef}>
                <label>Buscar producto</label>
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Escriba el nombre del producto..."
                    value={busqueda}
                    onChange={(e) => {
                        setBusqueda(e.target.value);
                        setMostrarDrop(true);
                    }}
                    onFocus={() => setMostrarDrop(true)}
                />

                {mostrarDrop && (
                    <ul className="ventas-dropdown">
                        {productosFiltrados.length === 0 && (
                            <li className="ventas-dropdown-vacio">
                                No se encontraron productos
                            </li>
                        )}
                        {productosFiltrados.map(p => (
                            <li
                                key={p.id}
                                onClick={() => agregarAlCarrito(p)}
                                className={
                                    p.stock <= 0 ? 'agotado' : ''
                                }
                            >
                                <span className="ventas-dropdown-nombre">
                                    {p.nombre}
                                </span>
                                <span className="ventas-dropdown-info">
                                    ₡{p.precio} &middot; Stock: {p.stock}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {carrito.length > 0 && (
                <>
                    <div className="ventas-tabla-wrapper">
                        <table className="ventas-tabla">
                            <thead>
                                <tr>
                                    <th>Producto</th>
                                    <th>Precio</th>
                                    <th>Cantidad</th>
                                    <th>Subtotal</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {carrito.map(p => (
                                    <tr key={p.id}>
                                        <td>{p.nombre}</td>
                                        <td>₡{p.precio}</td>
                                        <td>
                                            <button
                                                className="ventas-qty-btn"
                                                onClick={() =>
                                                    cambiarCantidad(
                                                        p.id,
                                                        p.cantidad - 1
                                                    )
                                                }
                                            >
                                                −
                                            </button>
                                            <span className="ventas-qty-valor">
                                                {p.cantidad}
                                            </span>
                                            <button
                                                className="ventas-qty-btn"
                                                onClick={() =>
                                                    cambiarCantidad(
                                                        p.id,
                                                        p.cantidad + 1
                                                    )
                                                }
                                                disabled={
                                                    p.cantidad >= p.stock
                                                }
                                            >
                                                +
                                            </button>
                                        </td>
                                        <td>
                                            ₡{p.precio * p.cantidad}
                                        </td>
                                        <td>
                                            <button
                                                className="ventas-eliminar"
                                                onClick={() =>
                                                    eliminarDelCarrito(p.id)
                                                }
                                            >
                                                ×
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="ventas-pie">
                        <div className="ventas-metodo-pago">
                            <label>Método de pago</label>
                            <select
                                value={metodoPago}
                                onChange={(e) =>
                                    setMetodoPago(e.target.value)
                                }
                            >
                                {METODOS_PAGO.map(m => (
                                    <option key={m} value={m}>
                                        {m}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="ventas-total">
                            <span>Total:</span>
                            <strong>₡{total}</strong>
                        </div>

                        <button
                            className="ventas-registrar"
                            onClick={handleRegistrar}
                            disabled={enviando}
                        >
                            {enviando
                                ? 'Registrando...'
                                : 'Registrar Venta'}
                        </button>
                    </div>
                </>
            )}

            {carrito.length === 0 && !exito && (
                <p className="ventas-vacio">
                    Busque y seleccione productos para comenzar una venta
                </p>
            )}
        </div>
    );
}

export default DashboardVentas;
