const User = require('../models/unity.model');
const bcrypt = require('bcrypt');

exports.post = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Buscar usuario
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ error: 'Usuario no encontrado' });
        }

        // Comparar contraseña (usa bcrypt si está hasheada)
        const valido = await bcrypt.compare(password, user.password);
        if (!valido) {
            return res.status(400).json({ error: 'Contraseña incorrecta' });
        }

        // Login exitoso
        return res.json({ message: 'Login exitoso', username: user.username });
    } catch (err) {
        console.error('Error en login Unity:', err);
        res.status(500).json({ error: 'Error al crear la unidad' });
    }
};