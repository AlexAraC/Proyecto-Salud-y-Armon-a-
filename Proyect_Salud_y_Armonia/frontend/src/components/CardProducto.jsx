import { useState } from 'react';

import './CardProducto.css';

function CardProducto({ producto }) {

    const [modalAbierto, setModalAbierto] =
        useState(false);

    const [cantidad, setCantidad] =
        useState(1);

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
                        setModalAbierto(true)
                    }
                >
                    Ver detalles
                </button>

                <button
                    className="boton-carrito"
                >
                    Agregar al carrito
                </button>

            </div>

            {modalAbierto && (

                <div className="modal-fondo">

                    <div className="modal-producto">

                        <img
                            src={`http://localhost:3000${producto.imagen}`}
                            alt={producto.nombre}
                        />

                        <h2>
                            {producto.nombre}
                        </h2>

                        <p>
                            {producto.descripcion}
                        </p>

                        <p>
                            Categoria: {producto.categoria}
                        </p>

                        <p>
                            Precio: ₡{producto.precio}
                        </p>

                        <p>
                            Disponibles: {producto.stock}
                        </p>

                        <label>
                            Cantidad
                        </label>

                        <input
                            type="number"
                            min="1"
                            max={producto.stock}
                            value={cantidad}
                            onChange={(e) =>
                                setCantidad(
                                    Number(
                                        e.target.value
                                    )
                                )
                            }
                        />

                        <div className="modal-acciones">

                            <button
                                className="boton-agregar"
                            >
                                Agregar al carrito
                            </button>

                            <button
                                className="boton-cerrar"
                                onClick={() =>
                                    setModalAbierto(false)
                                }
                            >
                                Cerrar
                            </button>
                            <button
                                className="boton-reportar"
                                title="Reportar error"
                                >
                                ⚠
                             </button>

                        </div>

                    </div>

                </div>

            )}

        </>

    );

}

export default CardProducto;