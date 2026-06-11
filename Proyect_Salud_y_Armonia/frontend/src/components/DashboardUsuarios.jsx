import { useEffect, useState } from 'react';

import {
    obtenerUsuarios,
    cambiarRol
} from '../services/usuariosApi';

import {
    obtenerPedidosPorUsuario
} from '../services/pedidosApi';

import './DashboardUsuarios.css';

function DashboardUsuarios() {

    const [usuarios, setUsuarios] = useState([]);

    const [busqueda, setBusqueda] = useState('');

    const [filtroRol, setFiltroRol] = useState('Todos');

    const [mostrarModal, setMostrarModal] = useState(false);

    const [pedidosUsuario, setPedidosUsuario] = useState([]);

    const [nombreUsuario, setNombreUsuario] = useState('');



    useEffect(() => {

        cargarUsuarios();

    }, []);



    const cargarUsuarios = async () => {

        try {

            const respuesta = await obtenerUsuarios();

            setUsuarios(respuesta);

        }

        catch (error) {

            console.log(error);

        }

    };



    const cambiarRolUsuario = async (

        id,

        rolActual,

        nombre

    ) => {

        const nuevoRol =

            rolActual === 'admin'

                ?

                'usuario'

                :

                'admin';


        const confirmar = window.confirm(

            rolActual === 'admin'

                ?

                `¿Quitar permisos de administrador a ${nombre}?`

                :

                `¿Convertir a ${nombre} en administrador?`

        );


        if (!confirmar) return;


        try {

            await cambiarRol(

                id,

                nuevoRol

            );

            cargarUsuarios();

        }

        catch (error) {

            console.log(error);

        }

    };



    const verPedidos = async (

        id,

        nombre

    ) => {

        try {

            const respuesta = await obtenerPedidosPorUsuario(id);

            setPedidosUsuario(

                respuesta.pedidos

            );

            setNombreUsuario(nombre);

            setMostrarModal(true);

        }

        catch (error) {

            console.log(error);

        }

    };



    const usuariosFiltrados = usuarios.filter(

        usuario => {

            const coincideNombre =

                usuario.nombre

                    .toLowerCase()

                    .includes(

                        busqueda.toLowerCase()

                    );

            const coincideRol =

                filtroRol === 'Todos'

                ||

                usuario.rol === filtroRol;

            return (

                coincideNombre

                &&

                coincideRol

            );

        }

    );



    return (

        <div className="dashboard-usuarios">

            <div className="encabezado-usuarios">

                <input

                    type="text"

                    placeholder="Buscar usuario..."

                    value={busqueda}

                    onChange={

                        e =>

                            setBusqueda(

                                e.target.value

                            )

                    }

                />



                <select

                    value={filtroRol}

                    onChange={

                        e =>

                            setFiltroRol(

                                e.target.value

                            )

                    }

                >

                    <option>

                        Todos

                    </option>

                    <option value="admin">

                        admin

                    </option>

                    <option value="usuario">

                        usuario

                    </option>

                </select>

            </div>



            <table className="tabla-usuarios">

                <thead>

                    <tr>

                        <th>

                            Nombre

                        </th>

                        <th>

                            Correo

                        </th>

                        <th>

                            Dirección

                        </th>

                        <th>

                            Rol

                        </th>

                        <th>

                            Acciones

                        </th>

                    </tr>

                </thead>

                <tbody>

                    {

                        usuariosFiltrados.map(

                            usuario => (

                                <tr

                                    key={usuario.id}

                                >

                                    <td>

                                        {

                                            usuario.nombre

                                        }

                                    </td>

                                    <td>

                                        {

                                            usuario.correo

                                        }

                                    </td>

                                    <td>

                                        {

                                            usuario.direccion

                                        }

                                    </td>

                                    <td>

                                        <span

                                            className={

                                                `rol ${usuario.rol}`

                                            }

                                        >

                                            {

                                                usuario.rol

                                            }

                                        </span>

                                    </td>

                                    <td>

                                        <button

                                            className="btn-pedidos"

                                            onClick={() =>

                                                verPedidos(

                                                    usuario.id,

                                                    usuario.nombre

                                                )

                                            }

                                        >

                                            Ver pedidos

                                        </button>



                                        <button

                                            className="btn-rol"

                                            onClick={() =>

                                                cambiarRolUsuario(

                                                    usuario.id,

                                                    usuario.rol,

                                                    usuario.nombre

                                                )

                                            }

                                        >

                                            {

                                                usuario.rol === 'admin'

                                                    ?

                                                    'Hacer usuario'

                                                    :

                                                    'Hacer admin'

                                            }

                                        </button>

                                    </td>

                                </tr>

                            )

                        )

                    }

                </tbody>

            </table>



            {

                mostrarModal

                &&

                <div

                    className="modal-fondo"

                    onClick={() =>

                        setMostrarModal(false)

                    }

                >

                    <div

                        className="modal-pedidos"

                        onClick={

                            e =>

                                e.stopPropagation()

                        }

                    >

                        <h2>

                            Pedidos de

                            {' '}

                            {

                                nombreUsuario

                            }

                        </h2>

                        {

                            pedidosUsuario.length === 0

                            &&

                            <p>

                                Este usuario no ha realizado pedidos.

                            </p>

                        }



                        {

                            pedidosUsuario.map(

                                pedido => (

                                    <div

                                        key={pedido.id}

                                        className="pedido-card"

                                    >

                                        <h3>

                                            Pedido #

                                            {

                                                pedido.id

                                            }

                                        </h3>

                                        <p>

                                            Estado:

                                            {' '}

                                            {

                                                pedido.estado

                                            }

                                        </p>

                                        <p>

                                            Total:

                                            ₡

                                            {

                                                pedido.total

                                            }

                                        </p>

                                        <p>

                                            Método:

                                            {' '}

                                            {

                                                pedido.metodo_pago

                                            }

                                        </p>

                                    </div>

                                )

                            )

                        }



                        <button

                            className="btn-cerrar"

                            onClick={() =>

                                setMostrarModal(false)

                            }

                        >

                            Cerrar

                        </button>

                    </div>

                </div>

            }

        </div>

    );

}

export default DashboardUsuarios;