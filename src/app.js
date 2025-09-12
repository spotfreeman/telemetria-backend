const express = require('express');
const cors = require('cors');

// Importar las Rutas reorganizadas
const authRoutes = require('./routes/auth.routes');
const telemetryRoutes = require('./routes/telemetry.routes');
const dashboardRoutes = require('./routes/dashboard.routes');

// Importar rutas legacy (mantener compatibilidad)
const rpiRoutes = require('./routes/rpi.routes');
const notas = require('./routes/nota.routes');
const proyectos = require('./routes/proyectos.routes');
const archivosRoutes = require('./routes/archivos.routes');
const vacacionesRoutes = require('./routes/vacaciones.routes');
const serveripRoutes = require('./routes/serverip.routes');
const unityRoutes = require('./routes/unity.routes');

const app = express();

const corsOptions = {
    origin: ['https://telemetria-frontend.onrender.com'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json());

// Rutas reorganizadas (nuevas)
app.use('/api/auth', authRoutes);
app.use('/api/telemetry', telemetryRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Rutas legacy (mantener compatibilidad)
app.use('/api/temperaturas', require('./routes/temperatura.routes'));
app.use('/api/rpis', rpiRoutes);
app.use('/api/notas', notas);
app.use('/api/proyectos', proyectos);
app.use('/api/usuarios', require('./routes/usuarios/usuario.routes'));
app.use('/api/archivos', archivosRoutes);
app.use('/api/vacaciones', vacacionesRoutes);
app.use('/api/serverip', serveripRoutes);
app.use('/api/esp32', require('./esp32/esp32.routes'));
app.use('/api/unity', unityRoutes);

// Middleware para manejo de errores
const { errorHandler, notFound } = require('./middleware/error.middleware');

// Ruta no encontrada
app.use(notFound);

// Manejo global de errores
app.use(errorHandler);

module.exports = app;