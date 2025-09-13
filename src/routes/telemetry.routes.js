const express = require('express');
const router = express.Router();
const temperatureController = require('../controllers/telemetry/temperature.controller');
const esp32Controller = require('../controllers/telemetry/esp32.controller');
const verificarToken = require('../middleware/auth.middleware');
const { validarTemperatura } = require('../middleware/validation.middleware');

// Rutas de temperatura
router.get('/temperatures', verificarToken, temperatureController.getAll);
router.get('/temperatures/stats', verificarToken, temperatureController.getStats);
router.get('/temperatures/chart', verificarToken, temperatureController.getChartData);
router.get('/temperatures/:id', verificarToken, temperatureController.getById);
router.post('/temperatures', validarTemperatura, temperatureController.create);
router.put('/temperatures/:id', verificarToken, temperatureController.update);
router.delete('/temperatures/:id', verificarToken, temperatureController.deleteTemperature);

// Rutas ESP32
router.post('/esp32', esp32Controller.post); // Ruta pública para dispositivos
router.get('/esp32', verificarToken, esp32Controller.get);
router.get('/esp32/:deviceId', verificarToken, esp32Controller.getAll);
router.get('/esp32/:deviceId/stats', verificarToken, esp32Controller.getStats);
router.delete('/esp32/:id', verificarToken, esp32Controller.delete);
router.delete('/esp32/:deviceId/clean', verificarToken, esp32Controller.cleanOldData);

module.exports = router;

