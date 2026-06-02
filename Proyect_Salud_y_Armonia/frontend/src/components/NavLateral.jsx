import './NavLateral.css';

import { Link } from 'react-router-dom';

function MenuLateral() {

    return (

        <aside className="menu-lateral">

            <h2 className="menu-titulo">
                Administración
            </h2>
            <nav className="menu-opciones">

                <Link
                    to="/Menu Princpal"
                    className="menu-item">
                   Administracion General
                </Link>

                <Link
                    to="/gestionar-categorias"
                    className="menu-item"
                >
                    Gestionar Categorías
                </Link>

                <Link
                    to="/gestionar-productos"
                    className="menu-item"
                >
                    Gestionar Productos
                </Link>

                <Link
                    to="/gestionar-homepage"
                    className="menu-item"
                >
                    Gestionar HomePage
                </Link>

                <Link
                    to="/gestionar-pedidos"
                    className="menu-item"
                >
                    Gestionar Pedidos
                </Link>

                <Link
                    to="/gestionar-clientes"
                    className="menu-item"
                >
                    Gestionar Clientes
                </Link>

            </nav>
                        

        </aside>

    );

}

export default MenuLateral;