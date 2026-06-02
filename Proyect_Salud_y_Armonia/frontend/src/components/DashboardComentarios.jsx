import { useEffect, useMemo, useState } from 'react';

import { obtenerComentariosPorTipo } from '../services/comentariosApi';

import './DashboardComentarios.css';

const formatearFecha = (fecha) => {

    if (!fecha) {
        return 'Sin fecha';
    }

    return new Intl.DateTimeFormat(
        'es-CR',
        {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }
    ).format(new Date(fecha));

};

function ListaComentarios({ titulo, tipo, items }) {

    return (

        <section className="comentarios-card">

            <div className="comentarios-card-header">

                <div>

                    <p className="comentarios-etiqueta">
                        {tipo}
                    </p>

                    <h2>{titulo}</h2>

                </div>

                <span className="comentarios-contador">
                    {items.length}
                </span>

            </div>

            <div className="comentarios-lista">

                {
                    items.length === 0 ? (

                        <p className="comentarios-vacio">
                            No hay registros para mostrar.
                        </p>

                    ) : (

                        items.map((item) => (

                            <article
                                className="comentario-item"
                                key={item.id}
                            >

                                <div className="comentario-item-header">

                                    <strong>
                                        #{item.id}
                                    </strong>

                                    <span>
                                        {formatearFecha(item.fecha)}
                                    </span>

                                </div>

                                <p>
                                    {item.contenido}
                                </p>

                            </article>

                        ))

                    )
                }

            </div>

        </section>

    );

}

function DashboardComentarios() {

    const [comentarios, setComentarios] = useState([]);
    const [reportes, setReportes] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {

        const cargarComentarios = async () => {

            try {

                setCargando(true);
                setError('');

                const datos = await obtenerComentariosPorTipo();

                setComentarios(datos.comentarios || []);
                setReportes(datos.reportes || []);

            }

            catch (errorApi) {

                console.error(errorApi);
                setError('No se pudieron cargar los comentarios y reportes.');

            }

            finally {

                setCargando(false);

            }

        };

        cargarComentarios();

    }, []);

    const totalRegistros = useMemo(
        () => comentarios.length + reportes.length,
        [comentarios, reportes]
    );

    if (cargando) {

        return (
            <div className="comentarios-estado">
                Cargando comunicacion de clientes...
            </div>
        );

    }

    if (error) {

        return (
            <div className="comentarios-estado comentarios-error">
                {error}
            </div>
        );

    }

    return (

        <div className="dashboard-comentarios">

            <div className="comentarios-resumen">

                <div>

                    <p>Comunicacion de clientes</p>

                    <h2>
                        {totalRegistros} registros
                    </h2>

                </div>

                <div className="comentarios-resumen-metricas">

                    <span>
                        Comentarios: {comentarios.length}
                    </span>

                    <span>
                        Reportes: {reportes.length}
                    </span>

                </div>

            </div>

            <div className="comentarios-grid">

                <ListaComentarios
                    titulo="Comentarios"
                    tipo="Tipo comentario"
                    items={comentarios}
                />

                <ListaComentarios
                    titulo="Reportes"
                    tipo="Tipo reporte"
                    items={reportes}
                />

            </div>

        </div>

    );

}

export default DashboardComentarios;
