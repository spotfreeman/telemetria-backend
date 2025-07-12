const express = require('express');
const cors = require('cors');

// Importar las Rutas
const temperaturaRoutes = require('./routes/temperatura.routes');
const rpiRoutes = require('./routes/rpi.routes');
const notas = require('./routes/nota.routes');
const proyectos = require('./routes/proyectos.routes');
const usuarioRoutes = require('./routes/usuario.routes');
const archivosRoutes = require('./routes/archivos.routes');
const vacacionesRoutes = require('./routes/vacaciones.routes');
const serveripRoutes = require('./routes/serverip.routes');

// Importar las Rutas de ESP32
const esp32Routes = require('./esp32/esp32.routes');

// Test Unity MongoDB
const unityRoutes = require('./routes/unity.routes');

// Importa y usa las rutas de autenticación
const authRoutes = require('./routes/auth.routes');

const app = express();

//app.use(cors());

app.use(cors({
    origin: ['https://telemetria-frontend.onrender.com', 'https://chat.openai.com'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Rutas
app.use('/api/temperaturas', temperaturaRoutes);
app.use('/api/rpis', rpiRoutes);
app.use('/api/notas', notas);
app.use('/api/auth', authRoutes);
app.use('/api/proyectos', proyectos);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/archivos', archivosRoutes);
app.use('/api/vacaciones', vacacionesRoutes)
app.use('/api/serverip', serveripRoutes);
app.use('/api/esp32', esp32Routes);

// Test Unity MongoDB
app.use('/api/unity', unityRoutes);

module.exports = app;