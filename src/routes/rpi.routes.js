const express = require('express');
const router = express.Router();
const rpiController = require('../controllers/rpi.controller');

// Ruta para obtener todas las IPs de Raspberry Pi
router.get('/', rpiController.getAll);

module.exports = router;