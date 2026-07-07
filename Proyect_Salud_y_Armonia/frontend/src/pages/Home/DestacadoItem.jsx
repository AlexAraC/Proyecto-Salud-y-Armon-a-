import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import './DestacadoItem.css';

function DestacadoItem({ producto, index }) {

    const navigate = useNavigate();

    const [visible, setVisible] = useState(false);

    const ref = useRef(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setVisible(true);
                observer.disconnect();
            }
        }, { threshold: 0.2 });
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            className={`destacados-item ${index % 2 === 1 ? 'reverso' : ''} ${visible ? 'visible' : ''}`}
        >
            <div className="destacado-decoracion">
                <span className="deco-circulo deco-1"></span>
                <span className="deco-circulo deco-2"></span>
                <span className="deco-circulo deco-3"></span>
                <span className="deco-cruz">✚</span>
            </div>

            <img
                className="destacados-item-img"
                src={`http://localhost:3000${producto.imagen}`}
                alt={producto.nombre}
            />

            <div className="destacados-item-info">
                <div className="destacados-item-titulo-row">
                    <h3 className="destacados-item-nombre">
                        {producto.nombre}
                    </h3>

                    <span className="destacados-item-categoria">
                        {producto.categoria}
                    </span>
                </div>

                <p className="destacados-item-descripcion">
                    {producto.descripcion.replace(/-/g, '→')}
                </p>

                <div className="destacados-item-acciones">
                    <span className="destacados-item-precio">
                        ₡{producto.precio}
                    </span>

                    <button
                        className="destacados-item-btn"
                        onClick={() => navigate(`/producto/${producto.id}`)}
                    >
                        Comprar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DestacadoItem;
