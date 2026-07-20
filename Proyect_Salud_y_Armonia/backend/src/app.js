require('dotenv').config();
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');

// =====================================
// IMPORTAR EXPRESS
// =====================================

const { logError } = require('./utils/logger');
const { errorHandler } = require('./middlewares/errorHandler.middleware');


// =====================================
// CREAR APP EXPRESS
// =====================================

const app = express();
app.use(helmet());


// =====================================
// MANEJO DE ERRORES GLOBALES
// =====================================

process.on('uncaughtException', (err) => {

    logError(err, 'UNCAUGHT_EXCEPTION');

});

process.on('unhandledRejection', (err) => {

    logError(err, 'UNHANDLED_REJECTION');

});


// =====================================
// MIDDLEWARES
// =====================================

// Permite recibir JSON desde Postman o frontend
app.use(express.json({
    limit: "700kb"
}));

// =====================================
// CONEXIÓN DB
// =====================================

const { conectarDB } = require('./config/db');


// =====================================
// IMPORTAR RUTAS
// =====================================

// Productos
const productosRoutes =
    require('./routes/productos.routes');

// Categorías
const categoriasRoutes =
    require('./routes/categorias.routes');

// Usuarios
const usuariosRoutes =
    require('./routes/usuarios.routes');

// Login / Auth
const authRoutes =
    require('./routes/auth.routes');

// Pedidos
const pedidosRoutes =
    require('./routes/pedido.route');

// Inventario
const inventarioRoutes =
    require('./routes/inventario.route');

// Carrito
const carritoRoutes =
    require('./routes/carrito.route');

// Información CEO
const informacionCeoRoutes =
    require('./routes/informacionCeo.route');

// Información Institucional
const informacionInstitucionalRoutes =
    require('./routes/informacionInstitucional.route');

// Comentarios
const comentariosRoutes =
    require('./routes/comentario.route');

// Estadisticas 
const estadisticasRoute = 
    require('./routes/estadisticas.routes')

// Ventas Físicas
const ventasRoute =
    require('./routes/ventas.route');


// =====================================
// USAR RUTAS
// =====================================

// DEBUG (solo en desarrollo)
app.use('/uploads', (req, res, next) => {

    if (process.env.NODE_ENV === 'development') {
        console.log(
            'Archivo solicitado:',
            req.url
        );
    }

    next();

});











app.use(

    '/uploads',

    express.static(

        path.join(__dirname, '../uploads')

    )

);
app.use(cors());

// Productos
app.use('/productos', productosRoutes);

// Categorías
app.use('/categorias', categoriasRoutes);

// Usuarios
app.use('/usuarios', usuariosRoutes);

// Auth
app.use('/auth', authRoutes);

// Pedidos
app.use('/pedidos', pedidosRoutes);

// Inventario
app.use('/inventario', inventarioRoutes);

// Carrito
app.use('/carrito', carritoRoutes);

// Información CEO
app.use('/informacion-ceo', informacionCeoRoutes);

// Información Institucional
app.use(
    '/informacion-institucional',
    informacionInstitucionalRoutes
);

// Comentarios
app.use('/comentarios', comentariosRoutes);

//estadisticas

app.use('/estadisticas', estadisticasRoute);

// Ventas Físicas
app.use('/ventas', ventasRoute);


// =====================================
// ERROR HANDLER GLOBAL
// =====================================

app.use(errorHandler);


// =====================================
// CONECTAR DB
// =====================================


conectarDB();


// =====================================
// LEVANTAR SERVIDOR
// =====================================

app.listen(3000, () => {

    console.log('Servidor en puerto 3000');

});
