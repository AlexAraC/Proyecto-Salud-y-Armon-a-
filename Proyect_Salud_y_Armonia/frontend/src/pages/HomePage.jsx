import { useEffect, useState } from 'react';

import api from '../api/axios';


function HomePage() {
    // =====================================
    // ESTADO
    // =====================================

    const [productos, setProductos] = useState([]);


    // =====================================
    // OBTENER PRODUCTOS
    // =====================================

    const obtenerProductos = async () => {

        try {

            const respuesta = await api.get('/productos');

            console.log(respuesta.data);

            setProductos(respuesta.data.productos);

        } catch (error) {

            console.log(error);

        }

    };


    // =====================================
    // CUANDO CARGA LA PAGINA
    // =====================================

    useEffect(() => {
        console.log('useEffect ejecutado');

        obtenerProductos();

    }, []);


    return (

        <div>

            <h1>FUNCIONA REACT</h1>

            {
                productos.map((producto) => (

                    <div key={producto.id}>

                        <h3>{producto.nombre}</h3>

                        <p>{producto.descripcion}</p>

                        <p>₡ {producto.precio}</p>

                        <hr />

                    </div>

                ))
            }

        </div>

    );

}

export default HomePage;