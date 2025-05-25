require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Temperatura = require('./modelo');
const cors = require('cors');

const app = express();

// Configuración de CORS
app.use(cors({
    origin: 'https://telemetria-backend.onrender.com', // Cambia esto si tu frontend está en otra URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Conectado a MongoDB'))
    .catch(err => console.error('Error de conexión:', err));

app.use(express.json());

// Endpoint para consultar todas las temperaturas
app.get('/api/temperaturas', async (req, res) => {
    try {
        const temperaturas = await Temperatura.find();
        res.json(temperaturas);
    } catch (err) {
        console.error('Error al obtener temperaturas:', err); // <--- Agrega esto
        res.status(500).json({ error: 'Error al obtener temperaturas' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en puerto ${PORT}`);
});