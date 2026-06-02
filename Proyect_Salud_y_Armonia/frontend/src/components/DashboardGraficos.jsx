import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend
} from 'recharts';

const colores = [
    '#A3B18A',
    '#B86F5C',
    '#D9C7B0',
    '#8A9A5B',
    '#6B4F3A'
];
import './DashboardGraficos.css'

function DashboardGraficos({ ventas, productos }) {

    return (

        <div className="dashboard">

            {/* GRAFICO DE BARRAS */}

            <div className="dashboard-card">

                <h2>
                    Ventas últimos 3 meses
                </h2>

                <ResponsiveContainer
                    width="100%"
                    height={300}
                >

                    <BarChart data={ventas}>

                        <XAxis dataKey="mes" />

                        <YAxis />

                        <Tooltip />

                        <Bar
                            dataKey="ventas"
                            fill="#A3B18A"
                        />

                    </BarChart>

                </ResponsiveContainer>

            </div>

            {/* GRAFICO CIRCULAR */}

            <div className="dashboard-card">

                <h2>
                    Productos más vendidos
                </h2>

                <ResponsiveContainer
                    width="100%"
                    height={300}
                >

                    <PieChart>

                        <Pie
                            data={productos}
                            dataKey="vendidos"
                            nameKey="nombre_producto"
                            outerRadius={100}
                            label
                        >

                            {
                                productos.map(
                                    (entry, index) => (
                                        <Cell
                                            key={index}
                                            fill={
                                                colores[
                                                    index %
                                                    colores.length
                                                ]
                                            }
                                        />
                                    )
                                )
                            }

                        </Pie>

                        <Tooltip />

                        <Legend />

                    </PieChart>

                </ResponsiveContainer>

            </div>

        </div>

    );

}

export default DashboardGraficos;