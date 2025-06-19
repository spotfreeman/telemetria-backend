const Usuario = require('../models/usuario.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Registro
exports.register = async (req, res) => {
    try {
        const { username, password } = req.body;
        const hash = await bcrypt.hash(password, 10);
        const nuevoUsuario = new Usuario({ username, password: hash });
        await nuevoUsuario.save();
        res.status(201).json({ message: 'Usuario registrado' });
    } catch (err) {
        res.status(500).json({ error: 'Error al registrar usuario' });
    }
};

// Login con JWT
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const usuario = await Usuario.findOne({ username });
        if (!usuario) return res.status(401).json({ error: 'Usuario no encontrado' });

        const valido = await bcrypt.compare(password, usuario.password);
        if (!valido) return res.status(401).json({ error: 'Contraseña incorrecta' });

        // Generar el token JWT
        const token = jwt.sign(
            { userId: usuario._id, username: usuario.username },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        res.json({ message: 'Login exitoso', token });
    } catch (err) {
        res.status(500).json({ error: 'Error en login' });
    }
};

