const express = require('express');
const router = express.Router();
const userController = require('../../controllers/auth/user.controller');
const verificarToken = require('../../middleware/auth.middleware');

// Rutas de autenticación (ya están en auth.routes.js)
// router.post('/register', registerController.register);
// router.post('/login', loginController.login);

// Rutas protegidas para gestión de usuarios
router.get('/profile', verificarToken, userController.getProfile);
router.put('/profile', verificarToken, userController.updateProfile);
router.put('/change-password', verificarToken, userController.changePassword);

module.exports = router;