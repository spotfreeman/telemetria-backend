const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard/dashboard.controller');
const verificarToken = require('../middleware/auth.middleware');

// Todas las rutas del dashboard requieren autenticación
router.use(verificarToken);

// Estadísticas generales del dashboard
router.get('/stats', dashboardController.getStats);

// Datos para gráficos
router.get('/chart/temperature', dashboardController.getTemperatureChart);

// Alertas
router.get('/alerts', dashboardController.getAlerts);

module.exports = router;
