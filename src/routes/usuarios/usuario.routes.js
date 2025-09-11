const express = require('express');
const router = express.Router();
const registerController = require('../controllers/usuarios/register.controller');
const loginController = require('../controllers/usuarios/login.controller');

router.post('/register', registerController.register);
router.post('/login', loginController.login);

module.exports = router;