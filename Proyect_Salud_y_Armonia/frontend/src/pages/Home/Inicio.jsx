import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import HeroBackground from '../../assets/HeroBackground.png';
import Logo from '../../assets/logo.png';
import { obtenerDestacados } from '../../services/productosApi';
import DestacadoItem from './DestacadoItem';
import './Inicio.css';

const TEXTO = "Tu bienestar es nuestra prioridad. Productos naturales seleccionados para acompañarte cada día.";
const TITULO_DESTACADOS = "Le Ofrecemos la mejor calidad";

function Inicio() {

    const navigate = useNavigate();

    const [mostrarTexto] = useState(true);

    const [textoVisible, setTextoVisible] = useState('');

    const [mostrarBtns, setMostrarBtns] = useState(false);

    const [mostrarBtn2, setMostrarBtn2] = useState(false);

    const [destacados, setDestacados] = useState([]);

    const [tituloVisible, setTituloVisible] = useState('');

    const [mostrarTitulo, setMostrarTitulo] = useState(false);

    const [tituloCompleto, setTituloCompleto] = useState(false);

    const tituloRef = useRef(null);

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


    useEffect(() => {

        if (destacados.length === 0 || !tituloRef.current) return;

        const observer = new IntersectionObserver(([entry]) => {

            if (entry.isIntersecting) {

                setMostrarTitulo(true);

                observer.disconnect();

            }

        }, { threshold: 0.3 });

        observer.observe(tituloRef.current);

        return () => observer.disconnect();

    }, [destacados]);


    useEffect(() => {

        if (!mostrarTitulo) return;

        let i = 0;

        const interval = setInterval(() => {

            setTituloVisible(TITULO_DESTACADOS.slice(0, i + 1));

            i++;

            if (i >= TITULO_DESTACADOS.length) {

                clearInterval(interval);

                setTituloCompleto(true);

            }

        }, 50);

        return () => clearInterval(interval);

    }, [mostrarTitulo]);


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

            <span className="hoja hoja-1">🍂</span>
            <span className="hoja hoja-2">🍁</span>
            <span className="hoja hoja-3">🍂</span>
            <span className="hoja hoja-4">🍁</span>
            <span className="hoja hoja-5">🍂</span>
            <span className="hoja hoja-6">🍁</span>
            <span className="hoja hoja-7">🍂</span>
            <span className="hoja hoja-8">🍁</span>

        </section>

            {destacados.length > 0 && (
                <section className="destacados">

                    <h2 ref={tituloRef} className={`destacados-titulo ${mostrarTitulo ? 'visible' : ''} ${tituloCompleto ? 'completo' : ''}`}>
                        {tituloVisible}
                        {mostrarTitulo && !tituloCompleto && (
                            <span className="destacados-cursor">|</span>
                        )}
                    </h2>

                    <div className="destacados-lista">

                        {destacados.map((p, i) => (
                            <DestacadoItem key={p.id} producto={p} index={i} />
                        ))}

                    </div>

                </section>
            )}

        </>

    );

}

export default Inicio;
