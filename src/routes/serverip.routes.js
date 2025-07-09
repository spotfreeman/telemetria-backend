const express = require('express');
const router = express.Router();
const serverIpController = require('../controllers/serverip.controller');
// Ruta para obtener todas las IPs del servidor
router.get('/', serverIpController.getAll);

module.exports = router;