const express = require('express');
const router = express.Router();
const unityController = require('../controllers/unity.controller');


// Ruta para crear una nueva unidad
router.post('/', unityController.post);
router.post('/update', unityController.update);

// Exportar el router
module.exports = router;

