const express = require('express');
const router = express.Router();
const Usuario = require('../models/usuarios.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const verificarToken = require('../middleware/auth.middleware');

// Clave secreta para firmar el token (guárdala en una variable de entorno en producción)
const SECRET_KEY = 'miclavesecreta';

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const usuario = await Usuario.findOne({ email });
        if (!usuario) {
            return res.status(400).json({ mensaje: 'Usuario no encontrado' });
        }
        const esValida = await bcrypt.compare(password, usuario.password);
        if (!esValida) {
            return res.status(400).json({ mensaje: 'Contraseña incorrecta' });
        }
        // Generar token JWT
        const token = jwt.sign(
            { id: usuario._id, email: usuario.email, nombre: usuario.nombre },
            SECRET_KEY,
            { expiresIn: '2h' }
        );
        res.json({ mensaje: 'Login exitoso', token });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el servidor' });
    }
});

// Ruta protegida de ejemplo
router.get('/pagina-protegida', verificarToken, (req, res) => {
    res.json({
        mensaje: '¡Bienvenido a la página protegida!',
        usuario: req.usuario
    });
});

module.exports = router;