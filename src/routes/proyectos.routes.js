const express = require('express');
const router = express.Router();
const proyectoController = require('../controllers/proyectos.controller');
const auth = require('../middlewares/auth');



// Ruta para obtener todos los proyectos
router.get('/', proyectoController.getAll);
// Ruta para obtener un proyecto por ID
router.get('/:id', proyectoController.getById);
// Ruta para crear un nuevo proyecto
router.post('/', auth, proyectoController.create);
// Ruta para actualizar un proyecto por ID
router.put('/:id', auth, proyectoController.update);
// Ruta para eliminar un proyecto por ID
router.delete('/:id', auth, proyectoController.delete);
// Exportar el router
module.exports = router;