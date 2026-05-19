require('dotenv').config();


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


// =====================================
// USAR RUTAS
// =====================================

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


// =====================================
// CONECTAR DB
// =====================================

console.log('Antes de conectar DB');

conectarDB();

console.log('Después de conectar DB');


// =====================================
// LEVANTAR SERVIDOR
// =====================================

app.listen(3000, () => {

    console.log('Servidor en puerto 3000');

});