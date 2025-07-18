const express = require('express');
const router = express.Router();
const esp32Controller = require('./esp32.controller');

router.get('/', esp32Controller.get);
router.get('/:deviceId', esp32Controller.getAll);
router.post('/', esp32Controller.post);
router.delete('/:id', esp32Controller.delete); // Ruta para eliminar un dispositivo ESP32

module.exports = router;
