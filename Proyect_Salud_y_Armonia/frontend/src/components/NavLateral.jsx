import './NavLateral.css';

function MenuLateral({ seccionActiva, cambiarSeccion }) {

    return (

        <aside className="menu-lateral">

            <h2 className="menu-titulo">
                Administracion
            </h2>

            <nav className="menu-opciones">

                <button
                    type="button"
                    className={`menu-item ${
                        seccionActiva === 'general'
                            ? 'activo'
                            : ''
                    }`}
                    onClick={() => cambiarSeccion('general')}
                >
                    Administracion General
                </button>

                <button
                    type="button"
                    className={`menu-item ${
                        seccionActiva === 'categorias'
                            ? 'activo'
                            : ''
                    }`}
                    onClick={() => cambiarSeccion('categorias')}
                >
                    Gestionar Categorias
                </button>

                <button
                    type="button"
                    className={`menu-item ${
                        seccionActiva === 'productos'
                            ? 'activo'
                            : ''
                    }`}
                    onClick={() => cambiarSeccion('productos')}
                >
                    Gestionar Productos
                </button>

                <button
                    type="button"
                    className={`menu-item ${
                        seccionActiva === 'homepage'
                            ? 'activo'
                            : ''
                    }`}
                    onClick={() => cambiarSeccion('homepage')}
                >
                    Gestionar HomePage
                </button>

                <button
                    type="button"
                    className={`menu-item ${
                        seccionActiva === 'pedidos'
                            ? 'activo'
                            : ''
                    }`}
                    onClick={() => cambiarSeccion('pedidos')}
                >
                    Gestionar Pedidos
                </button>

                <button
                    type="button"
                    className={`menu-item ${
                        seccionActiva === 'clientes'
                            ? 'activo'
                            : ''
                    }`}
                    onClick={() => cambiarSeccion('clientes')}
                >
                    Gestionar Clientes
                </button>

            </nav>

        </aside>

    );

}

export default MenuLateral;