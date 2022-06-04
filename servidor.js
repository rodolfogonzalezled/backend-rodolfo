const express = require('express');
const Contenedor = require('./contenedor.js');
const app = express();
const PORT = 8080;

const server = app.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${server.address().port}`)
});
server.on("error", error => console.log(`Error en servidor ${error}`));

app.get('/productos', async (req, res) => {
    let contenedor = new Contenedor('productos');
    let productos = await contenedor.getAll();
    if (productos.length > 0) {
        res.send({ productos });
    }else{
        res.send({ mensaje: 'El Archivo no posee elementos' });
    }
});

app.get('/productoRandom', async (req, res) => {
    let contenedor = new Contenedor('productos');
    let productos = await contenedor.getAll();
    let cantidadElementos = productos.length;
    if (cantidadElementos > 0) {
        let numeroRandom = Math.floor(Math.random() * cantidadElementos);
        let productoRandom = productos[numeroRandom];
        res.send({ producto: productoRandom });
    }else{
        res.send({ mensaje: 'El Archivo no posee elementos' });
    }

});