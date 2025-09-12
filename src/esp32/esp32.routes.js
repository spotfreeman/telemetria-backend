const express = require('express');
const router = express.Router();
const esp32Controller = require('../controllers/telemetry/esp32.controller');
const verificarToken = require('../middleware/auth.middleware');

// Ruta pública para que los dispositivos ESP32 envíen datos
router.post('/', esp32Controller.post);

// Rutas protegidas para administración
router.get('/', verificarToken, esp32Controller.get);
router.get('/:deviceId', verificarToken, esp32Controller.getAll);
router.get('/:deviceId/stats', verificarToken, esp32Controller.getStats);
router.delete('/:id', verificarToken, esp32Controller.delete);
router.delete('/:deviceId/clean', verificarToken, esp32Controller.cleanOldData);

module.exports = router;