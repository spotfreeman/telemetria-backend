const express = require('express');
const router = express.Router();
const notaController = require('../controllers/nota.controller');

// Ruta para obtener todas las notas
router.get('/', notaController.getAll);


// Ruta para obtener una nota por ID
router.get('/:id', notaController.getById);
// Ruta para crear una nueva nota
router.post('/', notaController.create);
// Ruta para actualizar una nota por ID
router.put('/:id', notaController.update);
// Ruta para eliminar una nota por ID
router.delete('/:id', notaController.delete);
// Exportar el router
module.exports = router;
