const Usuario = require('../../models/usuarios/usuario.model');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const usuario = await Usuario.findOne({ username });
        if (!usuario) return res.status(401).json({ error: 'Usuario no encontrado' });
        if (!usuario.activo) return res.status(403).json({ error: 'Usuario inactivo' });

        const valido = await usuario.compararPassword(password);
        if (!valido) return res.status(401).json({ error: 'Contraseña incorrecta' });

        const token = jwt.sign(
            { userId: usuario._id, username: usuario.username, rol: usuario.rol },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        res.json({
            message: 'Login exitoso',
            token,
            usuario: usuario.username,
            nombre: usuario.nombre,
            rol: usuario.rol
        });
    } catch (err) {
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
};

