import { useEffect, useState } from 'react';
import {
    actualizarCategoria,
    eliminarCategoria,
    obtenerCategorias
} from '../services/categoriasApi';

import './DashboardCategorias.css';

function DashboardCategorias() {

    const [categorias, setCategorias] = useState([]);
    const [categoriaAEliminar, setCategoriaAEliminar] = useState(null);
    const [categoriaAEditar, setCategoriaAEditar] = useState(null);
    const [nombreEditado, setNombreEditado] = useState('');
    const [error, setError] = useState('');
    const [guardando, setGuardando] = useState(false);

    useEffect(() => {

        const cargarCategorias = async () => {

            try {

                const datos = await obtenerCategorias();
                setCategorias(datos);

            } catch (errorCategorias) {

                console.error(errorCategorias);

            }

        };

        cargarCategorias();

    }, []);

    const abrirModalEditar = (categoria) => {

        console.log('Categoria seleccionada:', categoria);

        setCategoriaAEditar(categoria);
        setNombreEditado(categoria.nombre);
        setError('');

    };

    const abrirModalEliminar = (categoria) => {

        setCategoriaAEliminar(categoria);
        setError('');

    };

    const cerrarModales = () => {

        setCategoriaAEliminar(null);
        setCategoriaAEditar(null);
        setNombreEditado('');
        setError('');
        setGuardando(false);

    };

    const confirmarEliminar = async () => {

        if (!categoriaAEliminar) return;

        try {

            setGuardando(true);
            await eliminarCategoria(categoriaAEliminar.id);
            setCategorias((categoriasActuales) =>
                categoriasActuales.filter(
                    (categoria) => categoria.id !== categoriaAEliminar.id
                )
            );
            cerrarModales();

        } catch (errorEliminar) {

            console.error(errorEliminar);
            setError('No se pudo eliminar la categoria.');
            setGuardando(false);

        }

    };

    const guardarEdicion = async (evento) => {

        evento.preventDefault();

        if (!categoriaAEditar) return;

        const nombreLimpio = nombreEditado.trim();

        if (!nombreLimpio) {

            setError('El nombre no puede estar vacio.');
            return;

        }

        try {

            setGuardando(true);
            const categoriaActualizada = await actualizarCategoria(
                categoriaAEditar.id,
                { ...categoriaAEditar, nombre: nombreLimpio }
            );

            setCategorias((categoriasActuales) =>
                categoriasActuales.map((categoria) =>
                    categoria.id === categoriaAEditar.id
                        ? { ...categoria, ...categoriaActualizada, nombre: nombreLimpio }
                        : categoria
                )
            );
            cerrarModales();

        } catch (errorEditar) {

            console.error(errorEditar);
            setError('No se pudo editar la categoria.');
            setGuardando(false);

        }

    };

    return (

        <div className="dashboard-categorias">

            <div className="categorias-header">
                <h2>Categorias</h2>
                <button
                    type="button"
                    className="boton-agregar-categoria"
                    aria-label="Agregar categoria"
                >
                    <span className="boton-agregar-icono">+</span>
                    <span className="boton-agregar-texto">Agregar categoria</span>
                </button>
            </div>

            <div className="categorias-tabla-contenedor">
                <table className="tabla-categorias">

                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>

                    <tbody>

                        {categorias.map((categoria) => (
                            <tr key={categoria.id}>
                                <td>{categoria.id}</td>
                                <td>{categoria.nombre}</td>
                                <td>
                                    <button
                                        type="button"
                                        onClick={() => abrirModalEditar(categoria)}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => abrirModalEliminar(categoria)}
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}

                    </tbody>

                </table>
            </div>

            {categoriaAEliminar && (
                <div className="modal-fondo">
                    <div className="modal-categorias">
                        <h3>Eliminar categoria</h3>
                        <p>
                            Estas seguro de que deseas eliminar "{categoriaAEliminar.nombre}"?
                        </p>
                        {error && <p className="mensaje-error">{error}</p>}
                        <div className="modal-acciones">
                            <button
                                type="button"
                                onClick={cerrarModales}
                                disabled={guardando}
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                onClick={confirmarEliminar}
                                disabled={guardando}
                                className="boton-peligro"
                            >
                                {guardando ? 'Eliminando...' : 'Eliminar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {categoriaAEditar && (
                <div className="modal-fondo">
                    <form className="modal-categorias" onSubmit={guardarEdicion}>
                        <h3>Editar categoria</h3>
                        <label htmlFor="nombre-categoria">Nombre</label>
                        <input
                            id="nombre-categoria"
                            type="text"
                            value={nombreEditado}
                            onChange={(evento) => setNombreEditado(evento.target.value)}
                            autoFocus
                        />
                        {error && <p className="mensaje-error">{error}</p>}
                        <div className="modal-acciones">
                            <button
                                type="button"
                                onClick={cerrarModales}
                                disabled={guardando}
                            >
                                Cancelar
                            </button>
                            <button type="submit" disabled={guardando}>
                                {guardando ? 'Guardando...' : 'Guardar'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

        </div>

    );

}

export default DashboardCategorias;
