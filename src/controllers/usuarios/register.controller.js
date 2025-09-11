const Usuario = require('../../models/usuarios/usuario.model');

exports.register = async (req, res) => {
    try {
        const { username, password, email, nombre, apellido, rol, departamento } = req.body;

        if (!username || !password || !email) {
            return res.status(400).json({ error: 'Faltan campos obligatorios' });
        }

        const nuevoUsuario = new Usuario({
            username,
            password,
            email,
            nombre,
            apellido,
            rol,
            departamento,
            activo: true
        });

        await nuevoUsuario.save();
        res.status(201).json({ message: 'Usuario registrado' });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ error: 'El usuario o email ya existe' });
        }
        res.status(500).json({ error: 'Error al registrar usuario' });
    }
};