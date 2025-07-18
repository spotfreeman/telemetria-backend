const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuario.controller');
const auth = require('../middleware/auth');


router.post('/:register', usuarioController.register);
router.post('/:login', usuarioController.login);

router.get('/:me', auth, usuarioController.getProfile);
router.put('/:me', auth, usuarioController.updateProfile);

module.exports = router;