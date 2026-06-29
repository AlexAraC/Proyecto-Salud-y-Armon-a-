import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import CardProducto from '../../components/CardProducto';
import { obtenerProductos } from '../../services/productosApi';
import { obtenerCategorias } from '../../services/categoriasApi';
import {
    obtenerCarrito,
    agregarAlCarrito,
    actualizarCantidad,
    eliminarDelCarrito,
    vaciarCarrito as vaciarCarritoApi
} from '../../services/carritoApi';
import {
    obtenerCarritoLocal,
    agregarAlCarritoLocal,
    actualizarCantidadLocal,
    eliminarDelCarritoLocal,
    vaciarCarritoLocal,
    calcularTotalLocal
} from '../../services/carritoLocal';
import './CatalogoMain.css'

function DesplegarCatalogo(){

    const [searchParams, setSearchParams] = useSearchParams();
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [categoriaActiva, setCategoriaActiva] = useState('Todas');
    const [carritoAbierto, setCarritoAbierto] = useState(false);
    const [carritoItems, setCarritoItems] = useState([]);
    const [carritoTotal, setCarritoTotal] = useState(0);

    const [notificacion, setNotificacion] = useState(false);

    const usuarioLogueado = !!localStorage.getItem('token');

    const cargarCarrito = useCallback(async () => {
        if (usuarioLogueado) {
            const locales = obtenerCarritoLocal();
            if (locales.length > 0) {
                try {
                    for (const item of locales) {
                        await agregarAlCarrito(item.producto_id, item.cantidad);
                    }
                    vaciarCarritoLocal();
                } catch (e) {
                    console.error(e);
                }
            }
            try {
                const data = await obtenerCarrito();
                if (data.carrito && Array.isArray(data.carrito)) {
                    setCarritoItems(data.carrito);
                    setCarritoTotal(data.total || 0);
                } else {
                    setCarritoItems([]);
                    setCarritoTotal(0);
                }
            } catch {
                setCarritoItems([]);
                setCarritoTotal(0);
            }
        } else {
            const items = obtenerCarritoLocal();
            setCarritoItems(items);
            setCarritoTotal(calcularTotalLocal(items));
        }
    }, [usuarioLogueado]);

    useEffect(() => {
        cargarProductos();
        cargarCategorias();
        cargarCarrito();
    }, [cargarCarrito]);

    useEffect(() => {
        if (searchParams.get('carrito') === 'abierto') {
            setCarritoAbierto(true);
            setSearchParams({}, { replace: true });
        }
    }, [searchParams, setSearchParams]);

    const handleAgregarCarrito = async (producto_id, cantidad = 1) => {
        try {
            if (usuarioLogueado) {
                await agregarAlCarrito(producto_id, cantidad);
            } else {
                const producto = productos.find(
                    (p) => p.id === producto_id
                );
                if (producto) {
                    agregarAlCarritoLocal(producto, cantidad);
                }
            }
            cargarCarrito();
            setNotificacion(true);
            setTimeout(() => setNotificacion(false), 1200);
        } catch (error) {
            console.error(error);
        }
    };

    const handleActualizarCantidad = async (producto_id, cantidad) => {
        try {
            if (usuarioLogueado) {
                await actualizarCantidad(producto_id, cantidad);
            } else {
                actualizarCantidadLocal(producto_id, cantidad);
            }
            cargarCarrito();
        } catch (error) {
            console.error(error);
        }
    };

    const handleVaciarCarrito = async () => {
        try {
            if (usuarioLogueado) {
                await vaciarCarritoApi();
            } else {
                vaciarCarritoLocal();
            }
            cargarCarrito();
        } catch (error) {
            console.error(error);
        }
    };

    const handleCheckout = () => {
        if (!usuarioLogueado) {
            window.location.href = '/register';
            return;
        }
        window.location.href = '/confirmar-pedido';
    };

    const handleEliminarProducto = async (producto_id) => {
        try {
            if (usuarioLogueado) {
                await eliminarDelCarrito(producto_id);
            } else {
                eliminarDelCarritoLocal(producto_id);
            }
            cargarCarrito();
        } catch (error) {
            console.error(error);
        }
    };

    const cargarProductos = async () => {
        try{
            const datos = await obtenerProductos();
            setProductos(datos);
        }
        catch(error){
            console.error(error)
        }
    };

    const cargarCategorias = async () => {
        try{
            const datos = await obtenerCategorias();
            setCategorias(datos);
        }
        catch(error){
            console.error(error)
        }
    };

    const productosFiltrados = productos.filter((p) => {

        const coincideBusqueda = p.nombre
            .toLowerCase()
            .includes(busqueda.toLowerCase());

        const coincideCategoria =
            categoriaActiva === 'Todas' ||
            p.categoria_id === categoriaActiva ||
            p.categoria === categoriaActiva;

        return coincideBusqueda && coincideCategoria;

    });

    return(
        <div className="catalogo-layout">

            <aside className="catalogo-sidebar">

                <h2 className="catalogo-sidebar-titulo">
                    Categorías
                </h2>

                <nav className="catalogo-sidebar-opciones">

                    <div
                        className="catalogo-categoria-wrapper"
                        style={{ animationDelay: '0s' }}
                    >
                        <button
                            className={`catalogo-categoria-item ${
                                categoriaActiva === 'Todas'
                                    ? 'activo'
                                    : ''
                            }`}
                            onClick={() =>
                                setCategoriaActiva('Todas')
                            }
                        >
                            Todas
                        </button>
                    </div>

                    {categorias.map((cat, i) => (
                        <div
                            key={cat.id}
                            className="catalogo-categoria-wrapper"
                            style={{ animationDelay: `${(i + 1) * 0.05}s` }}
                        >
                            <button
                                className={`catalogo-categoria-item ${
                                    categoriaActiva === cat.id
                                        ? 'activo'
                                        : ''
                                }`}
                                onClick={() =>
                                    setCategoriaActiva(cat.id)
                                }
                            >
                                {cat.nombre}
                            </button>
                        </div>
                    ))}

                </nav>

            </aside>

            <div className="catalogo-contenido">

                <div className="catalogo-buscador">

                    <input
                        className="catalogo-input-busqueda"
                        type="text"
                        placeholder="Buscar productos..."
                        value={busqueda}
                        onChange={(e) =>
                            setBusqueda(e.target.value)
                        }
                    />

                </div>

                {productosFiltrados.length > 0 ? (

                    (() => {

                        const grupos = {};

                        productosFiltrados.forEach((p) => {
                            const clave = p.categoria || 'Sin categoría';
                            if (!grupos[clave]) {
                                grupos[clave] = [];
                            }
                            grupos[clave].push(p);
                        });

                        let idx = 0;

                        return Object.entries(grupos).map(([nombreCat, prods]) => (
                            <section
                                key={nombreCat}
                                className="catalogo-seccion"
                            >
                                <h3 className="catalogo-seccion-titulo">
                                    {nombreCat}
                                </h3>
                                <div className="catalogo-grid">
                                    {prods.map((p) => {
                                        const delay = idx * 0.04;
                                        idx++;
                                        return (
                                            <div
                                                key={p.id}
                                                className="catalogo-producto-wrapper"
                                                style={{ animationDelay: `${delay}s` }}
                                            >
                                                <CardProducto
                                                    producto={p}
                                                    tipo="catalogo"
                                                    onAgregarCarrito={handleAgregarCarrito}
                                                    onAgregarCarritoModal={(id, cant) => {
                                                        handleAgregarCarrito(id, cant);
                                                        setCarritoAbierto(true);
                                                    }}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>
                        ));

                    })()

                ) : (
                    <div className="catalogo-vacio">
                        <h3>No se encontraron productos</h3>
                        <p>
                            Intenta con otra categoría o término de búsqueda
                        </p>
                    </div>
                )}

            </div>

            <div className="boton-carrito-wrapper">

            <button
                className={`boton-carrito-flotante ${carritoAbierto ? 'abierto' : ''} ${notificacion ? 'pulso' : ''}`}
                onClick={() => setCarritoAbierto(!carritoAbierto)}
            >

                <span className="carrito-flotante-texto">Carrito</span>

                <svg

                    xmlns="http://www.w3.org/2000/svg"

                    width="28"

                    height="28"

                    viewBox="0 0 24 24"

                    fill="none"

                    stroke="white"

                    strokeWidth="2"

                    strokeLinecap="round"

                    strokeLinejoin="round"

                >

                    <circle cx="9" cy="21" r="1"/>

                    <circle cx="20" cy="21" r="1"/>

                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>

                </svg>

            </button>

                {notificacion && (
                    <span className="carrito-notificacion">Agregado</span>
                )}

            </div>

            <aside className={`carrito-sidebar ${carritoAbierto ? 'abierto' : ''}`}>

                <div className="carrito-sidebar-header">

                    <h2>Carrito de Compras</h2>

                    <button
                        className="carrito-sidebar-cerrar"
                        onClick={() => setCarritoAbierto(false)}
                    >
                        ✕
                    </button>

                </div>

                <div className="carrito-sidebar-contenido">

                    {carritoItems.length === 0 ? (

                        <p className="carrito-sidebar-vacio">
                            Tu carrito está vacío
                        </p>

                    ) : (

                        <>
                            {carritoItems.map((item) => (
                                <div key={item.detalle_id} className="carrito-item">

                                    <div className="carrito-item-info">

                                        <p className="carrito-item-nombre">
                                            {item.nombre}
                                        </p>

                                        <p className="carrito-item-precio">
                                            ₡{item.precio} c/u
                                        </p>

                                    </div>

                                    <div className="carrito-item-controls">

                                        <div className="carrito-item-cantidad">

                                            <button
                                                className="carrito-cantidad-btn"
                                                onClick={() =>
                                                    handleActualizarCantidad(
                                                        item.producto_id,
                                                        item.cantidad - 1
                                                    )
                                                }
                                                disabled={item.cantidad <= 1}
                                            >
                                                −
                                            </button>

                                            <span>{item.cantidad}</span>

                                            <button
                                                className="carrito-cantidad-btn"
                                                onClick={() =>
                                                    handleActualizarCantidad(
                                                        item.producto_id,
                                                        item.cantidad + 1
                                                    )
                                                }
                                            >
                                                +
                                            </button>

                                        </div>

                                        <p className="carrito-item-subtotal">
                                            ₡{item.subtotal}
                                        </p>

                                        <button
                                            className="carrito-item-eliminar"
                                            onClick={() =>
                                                handleEliminarProducto(
                                                    item.producto_id
                                                )
                                            }
                                            title="Eliminar"
                                        >
                                            🗑
                                        </button>

                                    </div>

                                </div>
                            ))}

                            <div className="carrito-sidebar-footer">

                                <div className="carrito-sidebar-total">

                                    <span>Total</span>

                                    <span className="carrito-total-monto">
                                        ₡{carritoTotal}
                                    </span>

                                </div>

                                <div className="carrito-sidebar-acciones">

                                    <button
                                        className="carrito-btn carrito-btn-vaciar"
                                        onClick={handleVaciarCarrito}
                                    >
                                        Limpiar carrito
                                    </button>

                                    <button
                                        className="carrito-btn carrito-btn-pedido"
                                        onClick={handleCheckout}
                                    >
                                        Realizar pedido
                                    </button>

                                </div>

                            </div>
                        </>

                    )}

                </div>

            </aside>

            {carritoAbierto && (
                <div
                    className="carrito-overlay"
                    onClick={() => setCarritoAbierto(false)}
                />
            )}

        </div>
    );

}

export default DesplegarCatalogo;
