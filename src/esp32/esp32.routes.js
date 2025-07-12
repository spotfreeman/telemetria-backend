const express = require('express');
const router = express.Router();
const esp32Controller = require('./esp32.controller');
const auth = require('../middleware/auth');

router.use(auth); // Middleware de autenticación para todas las rutas

router.get('/', auth, esp32Controller.getAll);
router.create('/', auth, esp32Controller.create);
router.delete('/:id', auth, esp32Controller.delete);

module.exports = router;
