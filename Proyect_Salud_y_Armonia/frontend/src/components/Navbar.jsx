import './Navbar.css';

import { Link } from 'react-router-dom';

import { useState } from 'react';

import logo from '../assets/logo.png';

function Navbar() {

    const [menuAbierto, setMenuAbierto] = useState(false);

    const token = localStorage.getItem('token');

    const cerrarSesion = () => {

        localStorage.removeItem('token');

        window.location.href = '/login';

    };

    return (

        <nav className="navbar">

            {/* LOGO */}
            <div className="navbar-logo">

                <img
                    src={logo}
                    alt="Logo"
                    className="navbar-logo-img"
                />

            </div>

            {/* BOTÓN HAMBURGUESA */}
            <div
                className={`hamburguesa ${menuAbierto ? 'activo' : ''}`}
                onClick={() => setMenuAbierto(!menuAbierto)}
            >

                ☰

            </div>

            {/* LINKS */}
            <div className={`navbar-links ${menuAbierto ? 'activo' : ''}`}>

                <Link to="/">Inicio</Link>

                <Link to="/catalogo">Catálogo</Link>

                <Link to="/acerca">Acerca de nosotros</Link>

                {

                    !token ? (

                        <Link to="/login">

                            Iniciar sesión

                        </Link>

                    ) : (

                        <button
                            className="cerrar-sesion-btn"
                            onClick={cerrarSesion}
                        >

                            Cerrar sesión

                        </button>

                    )

                }

            </div>

        </nav>

    );

}

export default Navbar;