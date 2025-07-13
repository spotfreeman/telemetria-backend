const express = require('express');
const router = express.Router();
const esp32Controller = require('./esp32.controller');
const auth = require('../middleware/auth');

router.use(auth); // Middleware de autenticación para todas las rutas

router.get('/', esp32Controller.getAll);
router.post('/', esp32Controller.create);
//router.post('/', esp32Controller.post); // Ruta para recibir datos del ESP32


module.exports = router;
