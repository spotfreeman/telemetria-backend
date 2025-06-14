const express = require('express');
const router = express.Router();
const unityController = require('../controllers/unity.controller');
const auth = require('../middleware/auth');

// Middleware de autenticación para todas las rutas
// router.use(auth);

// Ruta para obtener todas las unidades
router.get('/', auth, unityController.getAll);
// Ruta para obtener una unidad por ID
router.get('/:id', auth, unityController.getById);
// Ruta para crear una nueva unidad
router.post('/', unityController.create);
// Ruta para actualizar una unidad por ID
router.put('/:id', auth, unityController.update);
// Ruta para eliminar una unidad por ID
router.delete('/:id', auth, unityController.delete);
// Exportar el router
module.exports = router;
// Este archivo define las rutas para manejar las operaciones CRUD de unidades en la aplicación.
