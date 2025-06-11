const express = require('express');
const router = express.Router();
const archivosController = require('../controllers/archivos.controller');
const auth = require('../middleware/auth');

// Middleware de autenticación para todas las rutas
router.use(auth);

// Ruta para obtener todos los archivos
router.get('/', archivosController.getAll);
// Ruta para obtener un archivo por ID
router.get('/:id', archivosController.getById);
// Ruta para crear un nuevo archivo
router.post('/', archivosController.create);
// Ruta para actualizar un archivo por ID
router.put('/:id', archivosController.update);
// Ruta para eliminar un archivo por ID
router.delete('/:id', archivosController.delete);
// Exportar el router
module.exports = router;
