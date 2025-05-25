const express = require('express');
const cors = require('cors');

// Importar las rutas de temperatura, rpi y notas
const temperaturaRoutes = require('./routes/temperatura.routes');
const rpiRoutes = require('./routes/rpi.routes');
const notas = require('./routes/nota.routes'); // Importar las rutas de notas

const app = express();

app.use(cors({
    origin: 'https://telemetria-frontend.onrender.com',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Rutas
app.use('/api/temperaturas', temperaturaRoutes);
app.use('/api/rpis', rpiRoutes);
app.use('/api/notas', notas);

module.exports = app;