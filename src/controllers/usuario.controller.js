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

        res.json({
            message: 'Login exitoso',
            token,
            usuario: usuario.username,
            nombre: usuario.nombre,
            rol: usuario.rol
        });
    } catch (err) {
        res.status(500).json({ error: 'Error en login' });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.user.userId).select('-password');
        if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.json(usuario);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener perfil' });
    }
}
exports.updateProfile = async (req, res) => {
    try {
        const { nombre, apellido, email, departamento } = req.body;
        const usuario = await Usuario.findByIdAndUpdate(
            req.user.userId,
            { nombre, apellido, email, departamento },
            { new: true, runValidators: true }
        ).select('-password');

        if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.json(usuario);
    } catch (err) {
        res.status(500).json({ error: 'Error al actualizar perfil' });
    }
}

exports.changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const usuario = await Usuario.findById(req.user.userId);
        if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

        const valido = await bcrypt.compare(oldPassword, usuario.password);
        if (!valido) return res.status(401).json({ error: 'Contraseña actual incorrecta' });

        const hash = await bcrypt.hash(newPassword, 10);
        usuario.password = hash;
        await usuario.save();

        res.json({ message: 'Contraseña actualizada exitosamente' });
    } catch (err) {
        res.status(500).json({ error: 'Error al cambiar contraseña' });
    }
};