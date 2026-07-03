import './Navbar.css';

import { Link, useNavigate, useLocation } from 'react-router-dom';

import { useState, useEffect } from 'react';

import logo from '../assets/logo.png';

const obtenerRolDesdeToken = (token) => {

    if (!token) {
        return null;
    }

    try {

        const payload = JSON.parse(
            atob(token.split('.')[1])
        );

        return payload.rol;

    } catch (error) {

        console.error(error);

        return null;

    }

};

function Navbar() {

    const navigate = useNavigate();
    const location = useLocation();

    const [menuAbierto, setMenuAbierto] = useState(false);

    const [scrolled, setScrolled] = useState(false);

    const scrollToAcerca = () => {
        setMenuAbierto(false);
        if (location.pathname !== '/') {
            navigate('/');
            setTimeout(() => {
                document.getElementById('acerca-nosotros')?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } else {
            document.getElementById('acerca-nosotros')?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    useEffect(() => {

        const handleScroll = () => setScrolled(window.scrollY > 50);

        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);

    }, []);

    const token = localStorage.getItem('token');

    const esAdmin = obtenerRolDesdeToken(token) === 'admin';

    const cerrarSesion = () => {

        localStorage.removeItem('token');

        window.location.href = '/login';

    };

    return (

        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>

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

                <span className="navbar-link-acerca" onClick={scrollToAcerca}>Acerca de nosotros</span>

                {

                    esAdmin && (

                        <Link to="/administracion">

                            Panel administrativo

                        </Link>

                    )

                }

                {

                    !token ? (

                        <Link to="/login">

                            Iniciar sesión

                        </Link>

                    ) : (
                        <>

                        <Link to="/perfil" onClick={() => setMenuAbierto(false)}>

                            Perfil

                        </Link>

                        <button
                            className="cerrar-sesion-btn"
                            onClick={cerrarSesion}
                        >

                            Cerrar sesión

                        </button>

                        </>

                    )

                }

            </div>

        </nav>

    );

}

export default Navbar;
