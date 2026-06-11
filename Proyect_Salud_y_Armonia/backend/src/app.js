require('dotenv').config();
const path = require('path');
const cors = require('cors');

// =====================================
// IMPORTAR EXPRESS
// =====================================

const express = require('express');


// =====================================
// CREAR APP EXPRESS
// =====================================

const app = express();


// =====================================
// MANEJO DE ERRORES GLOBALES
// =====================================

process.on('uncaughtException', (err) => {

    console.log('ERROR NO CAPTURADO');

    console.log(err);

});

process.on('unhandledRejection', (err) => {

    console.log('PROMESA RECHAZADA');

    console.log(err);

});


// =====================================
// MIDDLEWARES
// =====================================

// Permite recibir JSON desde Postman o frontend
app.use(express.json());


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



// =====================================
// USAR RUTAS
// =====================================

// DEBUG
app.use('/uploads', (req, res, next) => {

    console.log(
        'Archivo solicitado:',
        req.url
    );

    next();

});

app.use(

    '/uploads',

    express.static(

        path.resolve(
            __dirname,
            '../uploads'
        )

    )

);






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