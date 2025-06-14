const unity = require('../models/unity.model');

exports.post = async (req, res) => {
    const { username, password } = req.body;

    // Buscar usuario
    const user = await User.findOne({ username });
    if (!user) {
        return res.status(400).json({ error: 'Usuario no encontrado' });
    }

    // Comparar contraseña directamente
    if (user.password !== password) {
        return res.status(400).json({ error: 'Contraseña incorrecta' });
    }

    // Login exitoso
    return res.json({ message: 'Login exitoso', username: user.username });
}


