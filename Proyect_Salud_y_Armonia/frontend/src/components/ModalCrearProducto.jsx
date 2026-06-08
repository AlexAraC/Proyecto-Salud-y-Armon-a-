import {
    useState,
    useEffect
} from 'react';
import './ModalCrearProducto.css'
import {
    crearProducto,
} from '../services/productosApi';

import {
    obtenerCategorias
} from '../services/categoriasApi';

function ModalCrearProducto({

    onCerrar,
    onProductoCreado

}) {

    const [nombre, setNombre] =
        useState('');

    const [descripcion,
        setDescripcion] =
        useState('');

    const [precio, setPrecio] =
        useState('');

    const [stock, setStock] =
        useState('');

    const [categoria_id,
        setCategoriaId] =
        useState('');

    const [imagen, setImagen] =
        useState(null);

    const [categorias,
        setCategorias] =
        useState([]);

    useEffect(() => {

        const cargarCategorias =
            async () => {

                try {

                    const datos =
                        await obtenerCategorias();

                    setCategorias(datos);

                } catch (error) {

                    console.error(error);

                }

            };

        cargarCategorias();

    }, []);

    const guardarProducto =
        async () => {

            console.log('ENTRO A GUARDAR');


            try {

                const respuesta =
                    await crearProducto({

                        nombre,
                        descripcion,
                        precio,
                        stock,
                        categoria_id,
                        imagen

                    });

                console.log(
                    'Producto creado:',
                    respuesta
                );

                await onProductoCreado();

                onCerrar();

            } catch (error) {

                console.log(
                    'ERROR:',
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

    return (

        <div className="modal-fondo">

            <div className="modal-producto">

                <h2>
                    Crear producto
                </h2>

                <input
                    type="text"
                    placeholder="Nombre"
                    value={nombre}
                    onChange={(e) =>
                        setNombre(
                            e.target.value
                        )
                    }
                />

                <textarea
                    placeholder="Descripción"
                    value={descripcion}
                    onChange={(e) =>
                        setDescripcion(
                            e.target.value
                        )
                    }
                />

                <input
                    type="number"
                    placeholder="Precio"
                    value={precio}
                    onChange={(e) =>
                        setPrecio(
                            e.target.value
                        )
                    }
                />

                <input
                    type="number"
                    placeholder="Stock"
                    value={stock}
                    onChange={(e) =>
                        setStock(
                            e.target.value
                        )
                    }
                />

                <select

                    value={categoria_id}

                    onChange={(e) =>
                        setCategoriaId(
                            e.target.value
                        )
                    }

                >

                    <option value="">

                        Seleccione una categoría

                    </option>

                    {

                        categorias.map(

                            (categoria) => (

                                <option

                                    key={categoria.id}

                                    value={categoria.id}

                                >

                                    {categoria.nombre}

                                </option>

                            )

                        )

                    }

                </select>

                <input
                    type="file"
                    onChange={(e) =>
                        setImagen(
                            e.target.files[0]
                        )
                    }
                />
                <div className="modal-acciones">

                    <button
                        type='button'
                        onClick={() => {


                            guardarProducto();

                        }}
                    >
                        Guardar
                    </button>

                    <button
                        onClick={() => {

                            console.log(
                                'Cerrar modal'
                            );

                            onCerrar();

                        }}
                    >
                        Cancelar
                    </button>

                </div>

            </div>

        </div>

    );

}

export default ModalCrearProducto;