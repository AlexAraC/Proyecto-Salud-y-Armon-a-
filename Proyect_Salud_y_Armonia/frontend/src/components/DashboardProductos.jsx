import { useEffect, useState } from 'react';
import CardProducto from './CardProducto';
import ModalCrearProducto from './ModalCrearProducto';

import './DashboardProductos.css';

import {
    obtenerProductos,
    eliminarProducto,
    actualizarProducto,
    agregarDestacado,
    quitarDestacado
} from '../services/productosApi';
import { obtenerCategorias } from '../services/categoriasApi';

function DashboardProductos() {

    const [productos, setProductos] = useState([]);

    const [
        modalCrearAbierto,
        setModalCrearAbierto
    ] = useState(false);

    const [busqueda, setBusqueda] = useState('');
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    const [editandoProducto, setEditandoProducto] = useState(false);
    const [formEditar, setFormEditar] = useState({
        nombre: '', descripcion: '', precio: '', stock: '', categoria_id: '', imagen: null
    });
    const [categorias, setCategorias] = useState([]);

    const [filtroCategoria, setFiltroCategoria] =
        useState('Todas');

    const cargarProductos = async () => {

        try {

            const datos =
                await obtenerProductos();

            setProductos(datos);

            console.log(
                'Productos cargados:',
                datos
            );

            return datos;

        } catch (error) {

            console.error(error);

        }

    };

    useEffect(() => {

        const cargarDatosIniciales = async () => {

            try {

                const [prods, cats] = await Promise.all([
                    obtenerProductos(),
                    obtenerCategorias()
                ]);
                setProductos(prods);
                setCategorias(cats);

            } catch (error) {

                console.error(error);

            }

        };

        void cargarDatosIniciales();

    }, []);

    const handleEliminar = async (id) => {

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

        } catch (error) {

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

    const handleEditar = async (
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

            const datos =
                await cargarProductos();

            return datos;

        } catch (error) {

            console.error(error);

        }

    };

    const handleAgregarDestacado =
        async (id) => {

            try {

                await agregarDestacado(id);

                await cargarProductos();

            } catch (error) {

                console.error(error);

            }

        };

    const handleQuitarDestacado =
        async (id) => {

            try {

                await quitarDestacado(id);

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

    if (productoSeleccionado) {
        const p = productoSeleccionado;
        const iniciarEdicion = () => {
            setFormEditar({
                nombre: p.nombre,
                descripcion: p.descripcion,
                precio: p.precio,
                stock: p.stock,
                categoria_id: p.categoria_id,
                imagen: null
            });
            setEditandoProducto(true);
        };
        return (
            <div className="dashboard-productos">
                <div className="detalle-admin-producto">
                    <button
                        className="detalle-admin-volver"
                        onClick={() => {
                            setProductoSeleccionado(null);
                            setEditandoProducto(false);
                        }}
                    >
                        ← Volver al menú
                    </button>
                    {editandoProducto ? (
                        <div className="detalle-admin-editar">
                            <h2>Editar Producto</h2>
                            <input
                                type="text" placeholder="Nombre"
                                value={formEditar.nombre}
                                onChange={(e) => setFormEditar({ ...formEditar, nombre: e.target.value })}
                            />
                            <textarea
                                placeholder="Descripción"
                                rows={6}
                                value={formEditar.descripcion}
                                onChange={(e) => setFormEditar({ ...formEditar, descripcion: e.target.value })}
                            />
                            <input
                                type="number" placeholder="Precio"
                                value={formEditar.precio}
                                onChange={(e) => setFormEditar({ ...formEditar, precio: e.target.value })}
                            />
                            <input
                                type="number" placeholder="Stock"
                                value={formEditar.stock}
                                onChange={(e) => setFormEditar({ ...formEditar, stock: e.target.value })}
                            />
                            <select
                                value={formEditar.categoria_id}
                                onChange={(e) => setFormEditar({ ...formEditar, categoria_id: e.target.value })}
                            >
                                {categorias.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.nombre}
                                    </option>
                                ))}
                            </select>
                            <input
                                type="file"
                                onChange={(e) => setFormEditar({ ...formEditar, imagen: e.target.files[0] })}
                            />
                            <div className="detalle-admin-editar-acciones">
                                <button
                                    className="detalle-admin-btn detalle-admin-btn-guardar"
                                    onClick={async () => {
                                        const datos = await handleEditar(p.id, formEditar);
                                        setEditandoProducto(false);
                                        if (datos) {
                                            setProductoSeleccionado(
                                                datos.find(prod => prod.id === p.id) || null
                                            );
                                        }
                                    }}
                                >
                                    Guardar
                                </button>
                                <button
                                    className="detalle-admin-btn detalle-admin-btn-cancelar"
                                    onClick={() => setEditandoProducto(false)}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="detalle-admin-grid">
                            <div className="detalle-admin-imagen">
                                <img
                                    src={`http://localhost:3000${p.imagen}`}
                                    alt={p.nombre}
                                />
                            </div>
                            <div className="detalle-admin-info">
                                <span className="detalle-admin-categoria">
                                    {p.categoria}
                                </span>
                                <h2>{p.nombre}</h2>
                                <p className="detalle-admin-precio">₡{p.precio}</p>
                                <p className="detalle-admin-descripcion">{p.descripcion}</p>
                                <p className="detalle-admin-stock">
                                    Stock: <span>{p.stock} unidades</span>
                                </p>
                                <div className="detalle-admin-acciones">
                                    <button
                                        className="detalle-admin-btn detalle-admin-btn-editar"
                                        onClick={iniciarEdicion}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        className="detalle-admin-btn detalle-admin-btn-eliminar"
                                        onClick={() => {
                                            handleEliminar(p.id);
                                            setProductoSeleccionado(null);
                                        }}
                                    >
                                        Eliminar
                                    </button>
                                    <button
                                        className="detalle-admin-btn detalle-admin-btn-destacado"
                                        onClick={async () => {
                                            if (p.destacado) {
                                                await handleQuitarDestacado(p.id);
                                            } else {
                                                await handleAgregarDestacado(p.id);
                                            }
                                            setProductoSeleccionado({ ...p, destacado: !p.destacado });
                                        }}
                                    >
                                        {p.destacado
                                            ? '⭐ Quitar de destacados'
                                            : '✨ Agregar a destacados'
                                        }
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                {modalCrearAbierto && (
                    <ModalCrearProducto
                        onCerrar={() => setModalCrearAbierto(false)}
                        onProductoCreado={cargarProductos}
                    />
                )}
            </div>
        );
    }

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

                <input
                    type="text"
                    placeholder="Buscar producto..."
                    value={busqueda}
                    onChange={(e) =>
                        setBusqueda(
                            e.target.value
                        )
                    }
                />

                <select
                    value={filtroCategoria}
                    onChange={(e) =>
                        setFiltroCategoria(
                            e.target.value
                        )
                    }
                >

                    <option value="Todas">
                        Todas
                    </option>

                    {

                        Object.keys(
                            productosPorCategoria
                        ).map(

                            categoria => (

                                <option
                                    key={categoria}
                                    value={categoria}
                                >

                                    {categoria}

                                </option>

                            )

                        )

                    }

                </select>

            </div>

            {

                Object.entries(
                    productosPorCategoria
                )

                    .filter(

                        ([categoria, productos]) => {

                            const coincideCategoria =

                                filtroCategoria === 'Todas'

                                ||

                                categoria === filtroCategoria;

                            const coincideBusqueda =

                                productos.some(

                                    producto =>

                                        producto.nombre
                                            .toLowerCase()
                                            .includes(
                                                busqueda.toLowerCase()
                                            )

                                );

                            return (
                                coincideCategoria
                                &&
                                coincideBusqueda
                            );

                        }

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

                                <div className="grid-productos">

                                    {

                                        productos

                                            .filter(

                                                producto =>

                                                    producto.nombre
                                                        .toLowerCase()
                                                        .includes(
                                                            busqueda.toLowerCase()
                                                        )

                                            )

                                            .map(

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

                                                        onAgregarDestacado={
                                                            handleAgregarDestacado
                                                        }

                                                        onQuitarDestacado={
                                                            handleQuitarDestacado
                                                        }

                                                        onVerDetalle={
                                                            setProductoSeleccionado
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

            {

                modalCrearAbierto && (

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
