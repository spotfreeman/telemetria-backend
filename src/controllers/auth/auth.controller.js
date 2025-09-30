const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const { formatErrorResponse, formatSuccessResponse } = require('../../utils/helpers');
const { HTTP_STATUS } = require('../../utils/constants');

/**
 * Iniciar sesión de usuario
 */
const login = async (req, res) => {
    try {
        console.log('🔐 Login intento - req.body:', req.body);
        console.log('🔐 Headers recibidos:', req.headers);
        console.log('🔐 Content-Type:', req.headers['content-type']);
        const { username, password } = req.body;

        // Validar datos de entrada
        if (!username || !password) {
            console.log('❌ Datos faltantes - username:', username, 'password:', password ? '***' : 'undefined');
            return res.status(HTTP_STATUS.BAD_REQUEST).json(
                formatErrorResponse('Username y password son requeridos')
            );
        }

        // Buscar usuario
        console.log('🔍 Buscando usuario:', username);
        const usuario = await User.findOne({ username });
        if (!usuario) {
            console.log('❌ Usuario no encontrado:', username);
            return res.status(HTTP_STATUS.UNAUTHORIZED).json(
                formatErrorResponse('Usuario no encontrado')
            );
        }
        console.log('✅ Usuario encontrado:', usuario.username, 'activo:', usuario.activo);

        // Verificar si el usuario está activo
        if (!usuario.activo) {
            return res.status(HTTP_STATUS.FORBIDDEN).json(
                formatErrorResponse('Usuario inactivo')
            );
        }

        // Verificar contraseña
        console.log('🔐 Verificando contraseña...');
        const valido = await usuario.compararPassword(password);
        if (!valido) {
            console.log('❌ Contraseña incorrecta para usuario:', username);
            return res.status(HTTP_STATUS.UNAUTHORIZED).json(
                formatErrorResponse('Contraseña incorrecta')
            );
        }
        console.log('✅ Contraseña correcta para usuario:', username);

        // Actualizar último acceso
        usuario.ultimoAcceso = new Date();
        await usuario.save();

        // Generar token JWT
        const token = jwt.sign(
            {
                userId: usuario._id,
                username: usuario.username,
                rol: usuario.rol,
                email: usuario.email
            },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        // Respuesta compatible con frontend existente
        res.json({
            message: 'Login exitoso',
            token,
            usuario: usuario.username,
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            email: usuario.email,
            rol: usuario.rol
        });

    } catch (err) {
        console.error('Error en login:', err);
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
            formatErrorResponse('Error al iniciar sesión')
        );
    }
};

/**
 * Registrar nuevo usuario
 */
const register = async (req, res) => {
    try {
        const { username, password, email, nombre, apellido, rol, departamento } = req.body;

        // Validar datos requeridos
        if (!username || !password || !email) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json(
                formatErrorResponse('Username, password y email son requeridos')
            );
        }

        // Crear nuevo usuario
        const nuevoUsuario = new User({
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

        // Respuesta compatible con frontend existente
        res.status(HTTP_STATUS.CREATED).json({
            message: 'Usuario registrado exitosamente',
            id: nuevoUsuario._id,
            username: nuevoUsuario.username,
            email: nuevoUsuario.email
        });

    } catch (err) {
        console.error('Error en registro:', err);

        if (err.code === 11000) {
            const campo = Object.keys(err.keyValue)[0];
            return res.status(HTTP_STATUS.BAD_REQUEST).json(
                formatErrorResponse(`El ${campo} ya existe`)
            );
        }

        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
            formatErrorResponse('Error al registrar usuario')
        );
    }
};

/**
 * Verificar token y obtener información del usuario
 */
const verifyToken = async (req, res) => {
    try {
        const usuario = await User.findById(req.user.userId).select('-password');
        if (!usuario) {
            return res.status(HTTP_STATUS.NOT_FOUND).json(
                formatErrorResponse('Usuario no encontrado')
            );
        }

        res.json(formatSuccessResponse({
            id: usuario._id,
            username: usuario.username,
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            email: usuario.email,
            rol: usuario.rol,
            departamento: usuario.departamento,
            activo: usuario.activo
        }));

    } catch (err) {
        console.error('Error al verificar token:', err);
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
            formatErrorResponse('Error al verificar token')
        );
    }
};

module.exports = {
    login,
    register,
    verifyToken
};
