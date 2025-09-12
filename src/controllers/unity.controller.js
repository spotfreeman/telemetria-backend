const User = require('../models/Unity');

exports.post = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Buscar usuario
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ error: 'Usuario no encontrado' });
        }

        // Comparar contraseña en texto plano (solo para pruebas)
        if (user.password !== password) {
            return res.status(400).json({ error: 'Contraseña incorrecta' });
        }

        // Si la contraseña es correcta, devolver los datos del usuario
        return res.json({
            username: user.username,
            level: user.level,
            coins: user.coins,
        });

        // Login exitoso
        // return res.json({ message: 'Login exitoso', username: user.username });


    } catch (err) {
        console.error('Error en login Unity:', err);
        res.status(500).json({ error: 'Error al crear la unidad' });
    }
};

// Actualizar datos de usuario
exports.update = async (req, res) => {
    try {
        const { username, level, coins } = req.body;
        const user = await User.findOneAndUpdate(
            { username },
            { level, coins },
            { new: true }
        );
        if (!user) return res.status(400).json({ error: 'Usuario no encontrado' });
        res.json({ message: 'Datos actualizados', user });
    } catch (err) {
        console.error('Error al actualizar usuario:', err);
        res.status(500).json({ error: 'Error al actualizar usuario' });
    }
};