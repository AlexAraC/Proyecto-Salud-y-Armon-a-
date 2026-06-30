import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import HeroBackground from '../../assets/HeroBackground.png';
import Logo from '../../assets/logo.png';
import { obtenerDestacados } from '../../services/productosApi';
import './Inicio.css';

const TEXTO = "Tu bienestar es nuestra prioridad. Productos naturales seleccionados para acompañarte cada día.";

function Inicio() {

    const navigate = useNavigate();

    const [mostrarTexto, setMostrarTexto] = useState(false);

    const [textoVisible, setTextoVisible] = useState('');

    const [mostrarBtns, setMostrarBtns] = useState(false);

    const [mostrarBtn2, setMostrarBtn2] = useState(false);

    const [destacados, setDestacados] = useState([]);

    const logoRef = useRef(null);


    useEffect(() => {

        obtenerDestacados()
            .then((data) => {
                if (Array.isArray(data)) {
                    setDestacados(data);
                }
            })
            .catch(console.error);

    }, []);


    useEffect(() => {

        const originalBg = document.body.style.background;

        const originalBgImg = document.body.style.backgroundImage;

        document.body.style.setProperty('background', '#000', 'important');

        document.body.style.setProperty('background-image', 'none', 'important');

        const timer = setTimeout(() => {

            document.body.style.removeProperty('background');

            document.body.style.removeProperty('background-image');

        }, 800);

        return () => {

            clearTimeout(timer);

            document.body.style.removeProperty('background');

            document.body.style.removeProperty('background-image');

        };

    }, []);


    useEffect(() => {

        const timer1 = setTimeout(
            () => setMostrarTexto(true),
            1900
        );

        return () => clearTimeout(timer1);

    }, []);


    useEffect(() => {

        if (!mostrarTexto) return;

        let i = 0;

        const interval = setInterval(() => {

            setTextoVisible(TEXTO.slice(0, i + 1));

            i++;

            if (i >= TEXTO.length - 4) {

                setMostrarBtns(true);

            }

            if (i >= TEXTO.length - 2) {

                setMostrarBtn2(true);

            }

            if (i >= TEXTO.length) {

                clearInterval(interval);

            }

        }, 20);

        return () => clearInterval(interval);

    }, [mostrarTexto]);


    return (

        <>

        <section
            className="hero"
            style={{
                backgroundImage: `url(${HeroBackground})`
            }}
        >

            <div className="hero-logo-wrapper">

                <img
                    ref={logoRef}
                    className="hero-logo"
                    src={Logo}
                    alt="Logo"
                />

            </div>

            <p className="hero-texto">

                {textoVisible}
                {mostrarTexto && textoVisible.length < TEXTO.length && (
                    <span className="hero-cursor">|</span>
                )}

            </p>

            <div className="hero-botones">

                <button
                    className={`hero-btn ${mostrarBtns ? 'visible' : ''}`}
                    onClick={() => navigate('/catalogo')}
                >

                    Productos

                </button>

                <button
                    className={`hero-btn hero-btn-outline ${mostrarBtn2 ? 'visible' : ''}`}
                    onClick={() => navigate('/contacto')}
                >

                    Contáctenos

                </button>

            </div>

        </section>

            {destacados.length > 0 && (
                <section className="destacados">

                    <h2 className="destacados-titulo">
                        Productos Destacados
                    </h2>

                    <div className="destacados-lista">

                        {destacados.map((p, i) => (
                            <div
                                key={p.id}
                                className={`destacados-item ${i % 2 === 1 ? 'reverso' : ''}`}
                            >

                                <img
                                    className="destacados-item-img"
                                    src={`http://localhost:3000${p.imagen}`}
                                    alt={p.nombre}
                                />

                                <div className="destacados-item-info">

                                    <h3 className="destacados-item-nombre">
                                        {p.nombre}
                                    </h3>

                                    <p className="destacados-item-descripcion">
                                        {p.descripcion}
                                    </p>

                                    <span className="destacados-item-precio">
                                        ₡{p.precio}
                                    </span>

                                </div>

                            </div>
                        ))}

                    </div>

                </section>
            )}

        </>

    );

}

export default Inicio;
