const express = require('express');
const router = express.Router();
const temperaturaController = require('../controllers/temperatura.controller');

// Ruta para obtener todas las temperaturas
router.get('/', temperaturaController.getAll);

module.exports = router;