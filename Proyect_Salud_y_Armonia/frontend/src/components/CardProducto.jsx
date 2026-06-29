import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';

import './CardProducto.css';

function CardProducto({

    producto,

    tipo,

    onEliminar,

    onEditar,

    onAgregarDestacado,

    onQuitarDestacado,

    onAgregarCarrito,
    onAgregarCarritoModal,
    onVerDetalle

}) {

    const [modalAbierto,
        setModalAbierto] =
        useState(false);

    const [modalEditarAbierto,
        setModalEditarAbierto] =
        useState(false);

    const navigate = useNavigate();

    const [cantidad,
        setCantidad] =
        useState(1);

    const [formulario,
        setFormulario] =
        useState({

            nombre:
                producto.nombre,

            descripcion:
                producto.descripcion,

            precio:
                producto.precio,

            stock:
                producto.stock,

            categoria_id:
                producto.categoria_id,

            imagen: null

        });

    const guardarCambios =
        async () => {

            await onEditar(

                producto.id,

                formulario

            );

            setModalEditarAbierto(
                false
            );

        };

    return (

        <>

            <div className="card-producto">

                <img
                    src={`http://localhost:3000${producto.imagen}`}
                    alt={producto.nombre}
                    className="producto-imagen"
                />

                <h3>
                    {producto.nombre}
                </h3>

                <p>
                    ₡{producto.precio}
                </p>

                <p>
                    Stock: {producto.stock}
                </p>

                <button
                    className="boton-detalles"
                    onClick={() =>
                        tipo === "catalogo"
                            ? navigate(`/producto/${producto.id}`)
                            : onVerDetalle
                                ? onVerDetalle(producto)
                                : setModalAbierto(true)
                    }
                >
                    Ver detalles
                </button>

                {tipo === "catalogo" && (

                    <button
                        className="boton-carrito"
                        onClick={() =>
                            onAgregarCarrito &&
                            onAgregarCarrito(producto.id, 1)
                        }
                    >
                        Agregar al carrito
                    </button>

                )}

                {tipo === "admin" && (

                    <>

                                    <button
                                        className="boton-cerrar-modal"
                                        onClick={() =>
                                            setModalAbierto(
                                                false
                                            )
                                        }
                                    >
                                        Cerrar
                                    </button>

                        <button
                            className="boton-eliminar"
                            onClick={() =>
                                onEliminar(
                                    producto.id
                                )
                            }
                        >
                            Eliminar
                        </button>

                   
                        <button
                            className={`boton-destacado ${
                                producto.destacado
                                    ? "activo"
                                    : ""
                            }`}
                            onClick={() =>
                                producto.destacado
                                    ? onQuitarDestacado(producto.id)
                                    : onAgregarDestacado(producto.id)
                            }
                        >

                            <span
                                className="texto-boton"
                                key={producto.destacado}
                            >
                                {
                                    producto.destacado
                                        ? "⭐ Quitar de destacados"
                                        : "✨ Agregar a destacados"
                                }
                            </span>

                        </button>
                        

                    </>

                )}

            </div>

            {modalAbierto && createPortal((

                <div className="modal-fondo">

                    <div className="modal-producto">

                        <div className="modal-grid">

                            <div className="modal-imagen-contenedor">
                                <img
                                    src={`http://localhost:3000${producto.imagen}`}
                                    alt={producto.nombre}
                                />
                            </div>

                            <div className="modal-info">

                                <span className="modal-categoria-etiqueta">
                                    {producto.categoria}
                                </span>

                                <h2>
                                    {producto.nombre}
                                </h2>

                                <p className="modal-precio">
                                    ₡{producto.precio}
                                </p>

                                <p className="modal-descripcion">
                                    {producto.descripcion}
                                </p>

                                <p className="modal-stock">
                                    Stock disponible: {' '}
                                    <span>{producto.stock} unidades</span>
                                </p>

                                {tipo === "catalogo" && (

                                    <div className="modal-cantidad">

                                        <label>
                                            Cantidad
                                        </label>

                                        <input
                                            type="number"
                                            min="1"
                                            max={
                                                producto.stock
                                            }
                                            value={cantidad}
                                            onChange={(e) =>
                                                setCantidad(
                                                    Number(
                                                        e.target.value
                                                    )
                                                )
                                            }
                                        />

                                    </div>

                                )}

                            </div>

                        </div>

                        <div className="modal-acciones">

                            {tipo === "catalogo" && (

                                <>

                                    <button
                                        className="boton-agregar"
                                        onClick={() => {
                                            const fn = onAgregarCarritoModal || onAgregarCarrito;
                                            fn && fn(
                                                producto.id,
                                                cantidad
                                            );
                                            setModalAbierto(false);
                                            setCantidad(1);
                                        }}
                                    >
                                        Agregar al carrito
                                    </button>

                                    <button
                                        className="boton-reportar"
                                        title="Reportar error"
                                    >
                                        ⚠
                                    </button>

                                    <button
                                        className="boton-cerrar"
                                        onClick={() =>
                                            setModalAbierto(
                                                false
                                            )
                                        }
                                    >
                                        Cerrar
                                    </button>

                                </>

                            )}

                            {tipo === "admin" && (

                                <>

                                    <button
                                        className="boton-editar"
                                        onClick={() =>
                                            setModalEditarAbierto(
                                                true
                                            )
                                        }
                                    >
                                        Editar
                                    </button>

                                    <button
                                        className="boton-eliminar"
                                        onClick={() =>
                                            onEliminar(
                                                producto.id
                                            )
                                        }
                                    >
                                        Eliminar
                                    </button>

                                    {producto.destacado ? (

                                        <button
                                            className="boton-destacado"
                                            onClick={() =>
                                                onQuitarDestacado(
                                                    producto.id
                                                )
                                            }
                                        >
                                            Quitar de destacados
                                        </button>

                                    ) : (

                                        <button
                                            className="boton-destacado"
                                            onClick={() =>
                                                onAgregarDestacado(
                                                    producto.id
                                                )
                                            }
                                        >
                                            Agregar a destacados
                                        </button>

                                    )}

                                    <button
                                        className="boton-cerrar"
                                        onClick={() =>
                                            setModalAbierto(
                                                false
                                            )
                                        }
                                    >
                                        Cerrar
                                    </button>

                                </>

                            )}

                        </div>

                    </div>

                </div>

            ), document.body)}

            {modalEditarAbierto && createPortal((

                <div className="modal-fondo">

                    <div className="modal-producto">

                        <h2>
                            Editar Producto
                        </h2>

                        <input
                            type="text"
                            value={
                                formulario.nombre
                            }
                            onChange={(e) =>
                                setFormulario({

                                    ...formulario,

                                    nombre:
                                        e.target.value

                                })
                            }
                        />

                        <textarea
                            value={
                                formulario.descripcion
                            }
                            onChange={(e) =>
                                setFormulario({

                                    ...formulario,

                                    descripcion:
                                        e.target.value

                                })
                            }
                        />

                        <input
                            type="number"
                            value={
                                formulario.precio
                            }
                            onChange={(e) =>
                                setFormulario({

                                    ...formulario,

                                    precio:
                                        e.target.value

                                })
                            }
                        />

                        <input
                            type="number"
                            value={
                                formulario.stock
                            }
                            onChange={(e) =>
                                setFormulario({

                                    ...formulario,

                                    stock:
                                        e.target.value

                                })
                            }
                        />

                        <input
                            type="file"
                            onChange={(e) =>
                                setFormulario({

                                    ...formulario,

                                    imagen:
                                        e.target.files[0]

                                })
                            }
                        />

                        <div
                            className="modal-acciones"
                        >

                            <button
                                className="boton-agregar"
                                onClick={
                                    guardarCambios
                                }
                            >
                                Guardar
                            </button>

                            <button
                                className="boton-cerrar"
                                onClick={() =>
                                    setModalEditarAbierto(
                                        false
                                    )
                                }
                            >
                                Cancelar
                            </button>

                        </div>

                    </div>

                </div>

            ), document.body)}

        </>

    );

}

export default CardProducto;
