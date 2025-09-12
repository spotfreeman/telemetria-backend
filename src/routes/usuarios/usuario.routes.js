const express = require('express');
const router = express.Router();
const authController = require('../../controllers/auth/auth.controller');
const userController = require('../../controllers/auth/user.controller');
const verificarToken = require('../../middleware/auth.middleware');
const { validarUsuario } = require('../../middleware/validation.middleware');

// Rutas de autenticación (para compatibilidad con frontend)
router.post('/login', authController.login);
router.post('/register', validarUsuario, authController.register);

// Rutas protegidas para gestión de usuarios
router.get('/profile', verificarToken, userController.getProfile);
router.put('/profile', verificarToken, userController.updateProfile);
router.put('/change-password', verificarToken, userController.changePassword);

module.exports = router;