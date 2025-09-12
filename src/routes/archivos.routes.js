const express = require('express');
const router = express.Router();
const archivosController = require('../controllers/archivos.controller');
const auth = require('../middleware/auth.middleware');

// Middleware de autenticación para todas las rutas
router.use(auth);

// Ruta para obtener todos los archivos
router.get('/', auth, archivosController.getAll);
// Ruta para obtener un archivo por ID
router.get('/:id', auth, archivosController.getById);
// Ruta para crear un nuevo archivo
router.post('/', auth, archivosController.create);
// Ruta para actualizar un archivo por ID
router.put('/:id', auth, archivosController.update);
// Ruta para eliminar un archivo por ID
router.delete('/:id', auth, archivosController.delete);
// Exportar el router
module.exports = router;
