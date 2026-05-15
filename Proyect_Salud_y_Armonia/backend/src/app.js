require('dotenv').config();
// Importamos el framework Express para crear el servidor web
const express = require('express'); // Se genera la aplicación Express
process.on('uncaughtException', (err) => {
    console.log('ERROR NO CAPTURADO');
    console.log(err);
});

process.on('unhandledRejection', (err) => {
    console.log('PROMESA RECHAZADA');
    console.log(err);
});
const app = express(); //Se declara la aplicación Express
//------------------------------------------------------------------
app.use(express.json());// Middleware para parsear el cuerpo de las solicitudes como JSON
// Importamos la función conectarDB desde el archivo de configuración de la base de datos
const { conectarDB } = require('./config/db');
//------------------------------------------------------------------
// Importamos las rutas desde el archivo de rutas correspondiente
const productosRoutes = require('./routes/productos.routes');
const categoriasRoutes = require('./routes/categorias.routes');
const usuariosRoutes = require('./routes/usuarios.routes');
const authRoutes = require('./routes/auth.routes');
//------------------------------------------------------------------


app.use('/productos', productosRoutes);// Middleware para usar las rutas de productos en la aplicación Express
app.use('/categorias', categoriasRoutes);// Middleware para usar las rutas de categorías en la aplicación Express
app.use('/usuarios', usuariosRoutes);// Middleware para usar las rutas de usuarios en la aplicación Express
app.use('/auth', authRoutes);
console.log('Antes de conectar DB');

conectarDB();

console.log('Después de conectar DB');
// Iniciamos el servidor en el puerto 3000 y mostramos un mensaje en la consola cuando esté listo
app.listen(3000, () => {
    console.log('Servidor en puerto 3000');
});