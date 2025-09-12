const express = require('express');
const router = express.Router();
const vacacionesController = require('../controllers/vacaciones.controller');
const auth = require('../middleware/auth.middleware');

// Middleware de autenticación para todas las rutas
router.use(auth);

// Ruta para obtener todas las vacaciones
router.get('/', auth, vacacionesController.getAll);
// Ruta para obtener vacaciones por ID
router.get('/:id', auth, vacacionesController.getById);
// Ruta para crear una nueva solicitud de vacaciones
router.post('/', auth, vacacionesController.create);
// Ruta para actualizar una solicitud de vacaciones por ID
router.put('/:id', auth, vacacionesController.update);
// Ruta para eliminar una solicitud de vacaciones por ID
router.delete('/:id', auth, vacacionesController.delete);

// Exportar el router
module.exports = router;
