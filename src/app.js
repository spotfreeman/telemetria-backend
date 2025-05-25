const express = require('express');
const cors = require('cors');
const temperaturaRoutes = require('./routes/temperatura.routes');

const app = express();

app.use(cors({
    origin: 'https://telemetria-frontend.onrender.com',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Rutas
app.use('/api/temperaturas', temperaturaRoutes);

module.exports = app;