const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth/auth.controller');
const userController = require('../controllers/auth/user.controller');
const verificarToken = require('../middleware/auth.middleware');
const { validarUsuario } = require('../middleware/validation.middleware');

// Rutas públicas de autenticación
router.post('/login', authController.login);
router.post('/register', validarUsuario, authController.register);
router.get('/verify', verificarToken, authController.verifyToken);

// Rutas protegidas de usuario
router.get('/profile', verificarToken, userController.getProfile);
router.put('/profile', verificarToken, userController.updateProfile);
router.put('/change-password', verificarToken, userController.changePassword);

// Rutas de administración (solo para admins)
router.get('/users', verificarToken, userController.getAllUsers);
router.put('/users/:id/status', verificarToken, userController.updateUserStatus);

module.exports = router;