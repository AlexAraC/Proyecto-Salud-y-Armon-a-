const express = require('express');// llamamos a express
const app = express();// creamos una instancia de express   

app.get('/', (req, res) => { //req significa request (solicitud) y res significa response (respuesta)
    res.send('Ruta principal'); // enviamos un mensaje de respuesta
});
app.get('/productos/:id', (req, res) => {

    const id = req.params.id;

    res.json({
        mensaje: 'Producto encontrado',
        idRecibido: id
    });

});
app.get('/users', (req, res) => { // ruta para usuarios
    res.send('Ruta de usuarios'); // enviamos un mensaje de respuesta
});
app.listen(3000, () => { // el servidor escucha en el puerto 3000
    console.log('Servidor escuchando en el puerto 3000'); // mensaje de consola para confirmar que el servidor está corriendo
});