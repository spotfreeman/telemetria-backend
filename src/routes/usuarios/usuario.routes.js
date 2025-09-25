const express = require('express');
const router = express.Router();
const authController = require('../../controllers/auth/auth.controller');
const userController = require('../../controllers/auth/user.controller');
const verificarToken = require('../../middleware/auth.middleware');
const { requireAdmin } = require('../../middleware/authorization.middleware');
const { validarUsuario } = require('../../middleware/validation.middleware');

// Rutas de autenticación (para compatibilidad con frontend)
router.post('/login', authController.login);
router.post('/register', validarUsuario, authController.register);

// Rutas protegidas para gestión de usuarios
router.get('/profile', verificarToken, userController.getProfile);
router.put('/profile', verificarToken, userController.updateProfile);
router.put('/change-password', verificarToken, userController.changePassword);

// Rutas de administración de usuarios (solo para administradores)
// IMPORTANTE: Las rutas con parámetros deben ir ANTES que las rutas genéricas
router.put('/:id/rol', verificarToken, requireAdmin, userController.updateUserRole);
router.delete('/:id', verificarToken, requireAdmin, userController.deleteUser);
router.get('/', verificarToken, requireAdmin, userController.getAllUsers);
router.post('/', verificarToken, requireAdmin, userController.createUser);

module.exports = router;