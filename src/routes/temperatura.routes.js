const express = require('express');
const router = express.Router();
const temperaturaController = require('../controllers/telemetry/temperature.controller');
const verificarToken = require('../middleware/auth.middleware');

// Rutas públicas (para dispositivos IoT)
router.post('/', temperaturaController.create);

// Rutas protegidas (para dashboard y administración)
router.get('/', verificarToken, temperaturaController.getAll);
router.get('/stats', verificarToken, temperaturaController.getStats);
router.get('/:id', verificarToken, temperaturaController.getById);
router.put('/:id', verificarToken, temperaturaController.update);
router.delete('/:id', verificarToken, temperaturaController.deleteTemperature);

module.exports = router;