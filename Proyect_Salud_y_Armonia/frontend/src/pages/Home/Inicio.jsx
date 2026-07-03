import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import HeroBackground from '../../assets/HeroBackground.png';
import Logo from '../../assets/logo.png';

import { obtenerDestacados } from '../../services/productosApi';
import { obtenerInformacionInstitucional } from '../../services/informacionInstitucionalApi';
import { obtenerInformacionCeo } from '../../services/informacionCeoApi';
import { crearComentario } from '../../services/comentariosApi';
import DestacadoItem from './DestacadoItem';
import './Inicio.css';

const TEXTO = "Tu bienestar es nuestra prioridad. Productos naturales seleccionados para acompañarte cada día.";
const TITULO_DESTACADOS = "Le Ofrecemos la mejor calidad";

const SVG_UBICACION = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3A312B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
const SVG_TELEFONO = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3A312B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
const SVG_EMAIL = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3A312B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;
const SVG_RELOJ = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3A312B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;

const INFO_UBICANOS = [
    { icon: SVG_UBICACION, text: 'San Carlos, Alajuela, Costa Rica', bold: true },
    { icon: SVG_TELEFONO, text: '8949-8822' },
    { icon: SVG_EMAIL, text: 'grassolhr@gmail.com' },
    { icon: SVG_RELOJ, text: 'Lunes a sábado, 10:00 a.m. - 6:00 p.m.' },
];

function Inicio() {

    const navigate = useNavigate();

    const [mostrarTexto] = useState(true);

    const [textoVisible, setTextoVisible] = useState('');

    const [mostrarBtns, setMostrarBtns] = useState(false);

    const [mostrarBtn2, setMostrarBtn2] = useState(false);

    const [destacados, setDestacados] = useState([]);

    const [empresa, setEmpresa] = useState(null);

    const [fundador, setFundador] = useState(null);
    const fundadorRef = useRef(null);
    const [fundadorVisible, setFundadorVisible] = useState(false);
    const [fundadorTituloTexto, setFundadorTituloTexto] = useState('');
    const [fundadorNombreTexto, setFundadorNombreTexto] = useState('');
    const [mostrarFundadorBio, setMostrarFundadorBio] = useState(false);
    const [fundadorContenedorExpandido, setFundadorContenedorExpandido] = useState(false);
    const [fundadorNombreCompleto, setFundadorNombreCompleto] = useState(false);
    const [fundadorLineaExpandida, setFundadorLineaExpandida] = useState(false);
    const [fundadorSloganTexto, setFundadorSloganTexto] = useState('');

    const comentarioRef = useRef(null);
    const [comentarioVisible, setComentarioVisible] = useState(false);
    const [comentarioTituloTexto, setComentarioTituloTexto] = useState('');
    const [comentarioIntroTexto, setComentarioIntroTexto] = useState('');
    const [comentarioContenedorVisible, setComentarioContenedorVisible] = useState(false);

    const [comentarioTexto, setComentarioTexto] = useState('');
    const [comentarioEnviado, setComentarioEnviado] = useState(false);
    const [comentarioError, setComentarioError] = useState('');

    const handleEnviarComentario = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setComentarioError('Debe iniciar sesión para dejar un comentario');
            return;
        }
        if (!comentarioTexto.trim()) {
            setComentarioError('Escriba un comentario antes de enviar');
            return;
        }
        setComentarioError('');
        try {
            await crearComentario({ tipo: 'comentario', contenido: comentarioTexto });
            setComentarioTexto('');
            setComentarioEnviado(true);
            setTimeout(() => setComentarioEnviado(false), 4000);
        } catch (error) {
            setComentarioError('Error al enviar el comentario');
        }
    };

    const acercaRef = useRef(null);
    const [acercaVisible, setAcercaVisible] = useState(false);
    const [acercaTituloTexto, setAcercaTituloTexto] = useState('');
    const [misionTitulo, setMisionTitulo] = useState('');
    const [visionTitulo, setVisionTitulo] = useState('');
    const [mostrarMisionTexto, setMostrarMisionTexto] = useState(false);
    const [mostrarVisionTexto, setMostrarVisionTexto] = useState(false);

    const [tituloVisible, setTituloVisible] = useState('');

    const [mostrarTitulo, setMostrarTitulo] = useState(false);

    const [tituloCompleto, setTituloCompleto] = useState(false);

    const [heroVisible, setHeroVisible] = useState(false);

    const tituloRef = useRef(null);

    const logoRef = useRef(null);

    const ubicanosRef = useRef(null);
    const [ubicanosVisible, setUbicanosVisible] = useState(false);
    const [mapaCargado, setMapaCargado] = useState(false);
    const [textosInfo, setTextosInfo] = useState(INFO_UBICANOS.map(() => ''));
    const [lineaActual, setLineaActual] = useState(-1);
    const [mostrarLineas, setMostrarLineas] = useState(false);


    useEffect(() => {
        setHeroVisible(true);
    }, []);

    useEffect(() => {

        obtenerDestacados()
            .then((data) => {
                if (Array.isArray(data)) {
                    setDestacados(data);
                }
            })
            .catch(console.error);

        obtenerInformacionInstitucional()
            .then((respuesta) => {
                if (respuesta.informacion?.length > 0) {
                    setEmpresa(respuesta.informacion[0]);
                }
            })
            .catch(console.error);

        obtenerInformacionCeo()
            .then((respuesta) => {
                if (respuesta.informacion?.length > 0) {
                    setFundador(respuesta.informacion[0]);
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

    useEffect(() => {
        const el = ubicanosRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setUbicanosVisible(true);
                observer.disconnect();
            }
        }, { threshold: 0.2 });
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (ubicanosVisible && mapaCargado) {
            setLineaActual(0);
        }
    }, [ubicanosVisible, mapaCargado]);

    useEffect(() => {
        if (lineaActual < 0 || lineaActual >= INFO_UBICANOS.length) return;

        const texto = INFO_UBICANOS[lineaActual].text;
        let i = 0;
        const interval = setInterval(() => {
            i++;
            setTextosInfo(prev => {
                const next = [...prev];
                next[lineaActual] = texto.slice(0, i);
                return next;
            });
            if (i >= texto.length) {
                clearInterval(interval);
                setTimeout(() => setLineaActual(prev => prev + 1), 300);
            }
        }, 25);

        return () => clearInterval(interval);
    }, [lineaActual]);

    useEffect(() => {
        if (lineaActual >= INFO_UBICANOS.length) {
            const timer = setTimeout(() => setMostrarLineas(true), 400);
            return () => clearTimeout(timer);
        }
    }, [lineaActual]);

    useEffect(() => {
        const el = acercaRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setAcercaVisible(true);
                observer.disconnect();
            }
        }, { threshold: 0.2 });
        observer.observe(el);
        return () => observer.disconnect();
    }, [empresa]);

    useEffect(() => {
        const el = fundadorRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setFundadorVisible(true);
                observer.disconnect();
            }
        }, { threshold: 0.5 });
        observer.observe(el);
        return () => observer.disconnect();
    }, [fundador]);

    useEffect(() => {
        const el = comentarioRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setComentarioVisible(true);
                observer.disconnect();
            }
        }, { threshold: 0.4 });
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!acercaVisible) return;

        const AT = 'Acerca de Nosotros';
        const MS = 'Misión';
        const VS = 'Visión';

        let a = 0;
        const intervalA = setInterval(() => {
            a++;
            setAcercaTituloTexto(AT.slice(0, a));
            if (a >= AT.length) {
                clearInterval(intervalA);
                setTimeout(() => {
                    let i = 0;
                    const interval1 = setInterval(() => {
                        i++;
                        setMisionTitulo(MS.slice(0, i));
                        if (i >= MS.length) {
                            clearInterval(interval1);
                            setMostrarMisionTexto(true);
                            setTimeout(() => {
                                let j = 0;
                                const interval2 = setInterval(() => {
                                    j++;
                                    setVisionTitulo(VS.slice(0, j));
                                    if (j >= VS.length) {
                                        clearInterval(interval2);
                                        setMostrarVisionTexto(true);
                                    }
                                }, 80);
                            }, 400);
                        }
                    }, 80);
                }, 300);
            }
        }, 60);

        return () => clearInterval(intervalA);
    }, [acercaVisible]);

    useEffect(() => {
        if (!fundadorVisible) return;
        const timer = setTimeout(() => {
            setFundadorContenedorExpandido(true);
        }, 200);
        return () => clearTimeout(timer);
    }, [fundadorVisible]);

    useEffect(() => {
        if (!fundadorContenedorExpandido || !fundador) return;

        const FT = 'Nuestro Fundador';
        const FN = fundador.nombre || '';

        let a = 0;
        const intervalA = setInterval(() => {
            a++;
            setFundadorTituloTexto(FT.slice(0, a));
            if (a >= FT.length) {
                clearInterval(intervalA);
                setTimeout(() => {
                    let i = 0;
                    const intervalN = setInterval(() => {
                        i++;
                        setFundadorNombreTexto(FN.slice(0, i));
                        if (i >= FN.length) {
                            clearInterval(intervalN);
                            setFundadorNombreCompleto(true);
                        }
                    }, 60);
                }, 300);
            }
        }, 60);

        return () => clearInterval(intervalA);
    }, [fundadorContenedorExpandido, fundador]);

    useEffect(() => {
        if (!fundadorNombreCompleto) return;
        const timer = setTimeout(() => {
            setFundadorLineaExpandida(true);
            setTimeout(() => {
                setMostrarFundadorBio(true);
            }, 600);
        }, 200);
        return () => clearTimeout(timer);
    }, [fundadorNombreCompleto]);

    useEffect(() => {
        if (!mostrarFundadorBio || !fundador?.slogan) return;

        const SL = fundador.slogan;
        let i = 0;
        const interval = setInterval(() => {
            i++;
            setFundadorSloganTexto(SL.slice(0, i));
            if (i >= SL.length) {
                clearInterval(interval);
            }
        }, 40);

        return () => clearInterval(interval);
    }, [mostrarFundadorBio, fundador]);

    useEffect(() => {
        if (!comentarioVisible) return;

        const CT = 'Deja tu comentario';
        const CI = 'Cuéntanos qué opinas';

        let i = 0;
        const intervalT = setInterval(() => {
            i++;
            setComentarioTituloTexto(CT.slice(0, i));
            if (i >= CT.length) {
                clearInterval(intervalT);
                setTimeout(() => {
                    let j = 0;
                    const intervalI = setInterval(() => {
                        j++;
                        setComentarioIntroTexto(CI.slice(0, j));
                        if (j >= CI.length) {
                            clearInterval(intervalI);
                            setTimeout(() => {
                                setComentarioContenedorVisible(true);
                            }, 300);
                        }
                    }, 40);
                }, 300);
            }
        }, 50);

        return () => clearInterval(intervalT);
    }, [comentarioVisible]);

    return (

        <>

        <section
            className={`hero ${heroVisible ? 'visible' : ''}`}
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

            <section ref={ubicanosRef} className={`ubicanos ${ubicanosVisible ? 'visible' : ''}`}>
                <div className="ubicanos-contenedor">
                    <h2 className="ubicanos-titulo">Ubícanos</h2>
                    <div className="ubicanos-grid">
                        <div className="ubicanos-mapa">
                            <iframe
                                src="https://www.google.com/maps?q=10%C2%B024'40.4%22N+84%C2%B028'17.9%22W&output=embed"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Ubicación"
                                onLoad={() => setMapaCargado(true)}
                            />
                        </div>
                        <div className={`ubicanos-info ${mostrarLineas ? 'mostrar-lineas' : ''}`}>
                            {INFO_UBICANOS.map((item, i) => (
                                <p key={i}>
                                    {item.icon}
                                    <span className="ubicanos-linea-texto">
                                        {item.bold ? <strong>{textosInfo[i]}</strong> : textosInfo[i]}
                                        {i === lineaActual && textosInfo[i].length < item.text.length && (
                                            <span className="ubicanos-cursor">|</span>
                                        )}
                                    </span>
                                </p>
                            ))}
                            <a
                                href="https://wa.me/message/V7PIT5A2TXLDJ1"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ubicanos-whatsapp"
                            >
                                Contáctanos por WhatsApp
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {empresa && (
                <section id="acerca-nosotros" ref={acercaRef} className={`acerca ${acercaVisible ? 'visible' : ''}`}>
                    <h2 className="acerca-titulo">{acercaTituloTexto}{acercaVisible && acercaTituloTexto.length < 18 && <span className="acerca-cursor">|</span>}</h2>
                    <div className="acerca-contenedor">
                        <div className={`acerca-logo ${acercaVisible ? 'visible' : ''}`}>
                            <img
                                src={
                                    empresa.imagen
                                        ? `http://localhost:3000${empresa.imagen}`
                                        : Logo
                                }
                                alt="Salud y Armonía"
                            />
                        </div>
                        <div className="acerca-textos">
                            {empresa.mision && (
                                <div className="acerca-bloque">
                                    <h3>{misionTitulo}{acercaVisible && misionTitulo.length < 6 && <span className="acerca-cursor">|</span>}</h3>
                                    <p className={`acerca-parrafo ${mostrarMisionTexto ? 'visible' : ''}`}>{empresa.mision}</p>
                                </div>
                            )}
                            {empresa.vision && (
                                <div className="acerca-bloque">
                                    <h3>{visionTitulo}{acercaVisible && visionTitulo.length < 6 && misionTitulo.length >= 6 && <span className="acerca-cursor">|</span>}</h3>
                                    <p className={`acerca-parrafo ${mostrarVisionTexto ? 'visible' : ''}`}>{empresa.vision}</p>
                                </div>
                            )}
                            <div className="acerca-contacto">
                                <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3A312B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>{empresa.telefono}</span>
                                <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3A312B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>{empresa.correo}</span>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {fundador && (
                <section ref={fundadorRef} className={`fundador ${fundadorVisible ? 'visible' : ''}`}>
                    <h2 className="fundador-titulo">{fundadorTituloTexto}{fundadorVisible && fundadorTituloTexto.length < 16 && <span className="fundador-cursor">|</span>}</h2>
                    <div className="fundador-wrapper">
                        {fundador.imagen && (
                            <div className="fundador-imagen">
                                <img
                                    src={`http://localhost:3000${fundador.imagen}`}
                                    alt={fundador.nombre}
                                />
                            </div>
                        )}
                        <div className={`fundador-contenedor ${fundadorContenedorExpandido ? 'expandido' : ''}`}>
                            <div className="fundador-info">
                                <h3 className={`fundador-nombre ${fundadorLineaExpandida ? 'linea-expandida' : ''}`}>{fundadorNombreTexto}{fundadorContenedorExpandido && fundadorNombreTexto.length < (fundador.nombre || '').length && fundadorTituloTexto.length >= 16 && <span className="fundador-cursor">|</span>}</h3>
                                {fundador.acerca_de_mi && (
                                    <p className={`fundador-bio ${mostrarFundadorBio ? 'visible' : ''}`}>{fundador.acerca_de_mi}</p>
                                )}
                                <div className="fundador-contacto">
                                    {fundador.telefono && <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3A312B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>{fundador.telefono}</span>}
                                    {fundador.correo && <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3A312B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>{fundador.correo}</span>}
                                </div>
                            </div>
                        </div>
                    </div>
                    {fundador.slogan && (
                        <p className="fundador-slogan">"{fundadorSloganTexto}"{mostrarFundadorBio && fundadorSloganTexto.length < fundador.slogan.length && <span className="fundador-cursor">|</span>}</p>
                    )}
                </section>
            )}

            <section ref={comentarioRef} className="comentario-seccion">
                <h2 className="comentario-titulo">{comentarioTituloTexto}{comentarioVisible && comentarioTituloTexto.length < 18 && <span className="comentario-cursor">|</span>}</h2>
                <div className={`comentario-contenedor ${comentarioContenedorVisible ? 'visible' : ''}`}>
                    <p className="comentario-intro">{comentarioIntroTexto}{comentarioVisible && comentarioTituloTexto.length >= 18 && comentarioIntroTexto.length < 19 && <span className="comentario-cursor">|</span>}</p>
                    {comentarioEnviado && <p className="comentario-exito">Comentario enviado correctamente</p>}
                    {comentarioError && <p className="comentario-error">{comentarioError}</p>}
                    {!localStorage.getItem('token') && (
                        <p className="comentario-advertencia">Debe iniciar sesión para dejar un comentario</p>
                    )}
                    <textarea
                        className="comentario-textarea"
                        placeholder="Escribe tu comentario aquí..."
                        value={comentarioTexto}
                        onChange={(e) => setComentarioTexto(e.target.value)}
                        disabled={!localStorage.getItem('token')}
                    />
                    <button
                        className="comentario-btn"
                        onClick={handleEnviarComentario}
                        disabled={!localStorage.getItem('token')}
                    >
                        Enviar comentario
                    </button>
                </div>
            </section>

        </>
    );

}

export default Inicio;
