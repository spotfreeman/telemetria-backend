const User = require('../../models/User');
const bcrypt = require('bcrypt');
const { formatErrorResponse, formatSuccessResponse } = require('../../utils/helpers');
const { HTTP_STATUS } = require('../../utils/constants');

/**
 * Obtener perfil del usuario autenticado
 */
const getProfile = async (req, res) => {
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
            activo: usuario.activo,
            ultimoAcceso: usuario.ultimoAcceso,
            avatar: usuario.avatar,
            createdAt: usuario.createdAt,
            updatedAt: usuario.updatedAt
        }));

    } catch (err) {
        console.error('Error al obtener perfil:', err);
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
            formatErrorResponse('Error al obtener perfil')
        );
    }
};

/**
 * Actualizar perfil del usuario
 */
const updateProfile = async (req, res) => {
    try {
        const { nombre, apellido, email, departamento, rol } = req.body;

        const updateData = {};
        if (nombre !== undefined) updateData.nombre = nombre;
        if (apellido !== undefined) updateData.apellido = apellido;
        if (email !== undefined) updateData.email = email;
        if (departamento !== undefined) updateData.departamento = departamento;
        if (rol !== undefined) updateData.rol = rol;

        const usuario = await User.findByIdAndUpdate(
            req.user.userId,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');

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
            activo: usuario.activo,
            ultimoAcceso: usuario.ultimoAcceso,
            avatar: usuario.avatar,
            updatedAt: usuario.updatedAt
        }, 'Perfil actualizado exitosamente'));

    } catch (err) {
        console.error('Error al actualizar perfil:', err);

        if (err.code === 11000) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json(
                formatErrorResponse('El email ya está en uso')
            );
        }

        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
            formatErrorResponse('Error al actualizar perfil')
        );
    }
};

/**
 * Cambiar contraseña del usuario
 */
const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json(
                formatErrorResponse('Contraseña actual y nueva contraseña son requeridas')
            );
        }

        if (newPassword.length < 6) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json(
                formatErrorResponse('La nueva contraseña debe tener al menos 6 caracteres')
            );
        }

        const usuario = await User.findById(req.user.userId);
        if (!usuario) {
            return res.status(HTTP_STATUS.NOT_FOUND).json(
                formatErrorResponse('Usuario no encontrado')
            );
        }

        // Verificar contraseña actual
        const valido = await usuario.compararPassword(oldPassword);
        if (!valido) {
            return res.status(HTTP_STATUS.UNAUTHORIZED).json(
                formatErrorResponse('Contraseña actual incorrecta')
            );
        }

        // Actualizar contraseña
        usuario.password = newPassword;
        await usuario.save();

        res.json(formatSuccessResponse(null, 'Contraseña actualizada exitosamente'));

    } catch (err) {
        console.error('Error al cambiar contraseña:', err);
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
            formatErrorResponse('Error al cambiar contraseña')
        );
    }
};

/**
 * Obtener todos los usuarios (solo para administradores)
 */
const getAllUsers = async (req, res) => {
    try {
        console.log('📋 getAllUsers ejecutándose');
        console.log('📋 req.user:', req.user);
        console.log('📋 req.query:', req.query);

        const { limit = 50, offset = 0, rol, activo } = req.query;

        let query = {};
        if (rol) query.rol = rol;
        if (activo !== undefined) query.activo = activo === 'true';

        const usuarios = await User.find(query)
            .select('-password')
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip(parseInt(offset));

        const total = await User.countDocuments(query);

        res.json(formatSuccessResponse({
            usuarios,
            total,
            limit: parseInt(limit),
            offset: parseInt(offset)
        }));

    } catch (err) {
        console.error('Error al obtener usuarios:', err);
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
            formatErrorResponse('Error al obtener usuarios')
        );
    }
};

/**
 * Actualizar estado de usuario (solo para administradores)
 */
const updateUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { activo, rol } = req.body;

        const updateData = {};
        if (activo !== undefined) updateData.activo = activo;
        if (rol !== undefined) updateData.rol = rol;

        const usuario = await User.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');

        if (!usuario) {
            return res.status(HTTP_STATUS.NOT_FOUND).json(
                formatErrorResponse('Usuario no encontrado')
            );
        }

        res.json(formatSuccessResponse({
            id: usuario._id,
            username: usuario.username,
            email: usuario.email,
            rol: usuario.rol,
            activo: usuario.activo
        }, 'Usuario actualizado exitosamente'));

    } catch (err) {
        console.error('Error al actualizar usuario:', err);
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
            formatErrorResponse('Error al actualizar usuario')
        );
    }
};

/**
 * Actualizar rol de usuario específico (solo para administradores)
 */
const updateUserRole = async (req, res) => {
    try {
        console.log('🔄 updateUserRole ejecutándose');
        console.log('🔄 req.params:', req.params);
        console.log('🔄 req.body:', req.body);

        const { id } = req.params;
        const { rol } = req.body;

        if (!rol) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json(
                formatErrorResponse('El rol es requerido')
            );
        }

        // Validar que el rol sea válido
        const rolesValidos = ['admin', 'user', 'viewer', 'editor'];
        if (!rolesValidos.includes(rol)) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json(
                formatErrorResponse('Rol inválido. Roles válidos: ' + rolesValidos.join(', '))
            );
        }

        // No permitir que un usuario cambie su propio rol
        if (req.user.userId === id) {
            return res.status(HTTP_STATUS.FORBIDDEN).json(
                formatErrorResponse('No puedes cambiar tu propio rol')
            );
        }

        const usuario = await User.findByIdAndUpdate(
            id,
            { rol },
            { new: true, runValidators: true }
        ).select('-password');

        if (!usuario) {
            return res.status(HTTP_STATUS.NOT_FOUND).json(
                formatErrorResponse('Usuario no encontrado')
            );
        }

        res.json(formatSuccessResponse({
            id: usuario._id,
            username: usuario.username,
            email: usuario.email,
            rol: usuario.rol,
            activo: usuario.activo
        }, 'Rol actualizado exitosamente'));

    } catch (err) {
        console.error('Error al actualizar rol:', err);
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
            formatErrorResponse('Error al actualizar rol')
        );
    }
};

/**
 * Crear nuevo usuario (solo para administradores)
 */
const createUser = async (req, res) => {
    try {
        console.log('👤 createUser ejecutándose');
        console.log('👤 req.body:', req.body);

        const { username, email, password, nombre, apellido, rol, departamento } = req.body;

        // Validaciones básicas
        if (!username || !email || !password) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json(
                formatErrorResponse('Username, email y password son requeridos')
            );
        }

        if (password.length < 6) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json(
                formatErrorResponse('La contraseña debe tener al menos 6 caracteres')
            );
        }

        // Validar rol si se proporciona
        if (rol) {
            const rolesValidos = ['admin', 'user', 'viewer', 'editor'];
            if (!rolesValidos.includes(rol)) {
                return res.status(HTTP_STATUS.BAD_REQUEST).json(
                    formatErrorResponse('Rol inválido. Roles válidos: ' + rolesValidos.join(', '))
                );
            }
        }

        // Verificar si el usuario ya existe
        const usuarioExistente = await User.findOne({
            $or: [
                { username: username },
                { email: email }
            ]
        });

        if (usuarioExistente) {
            if (usuarioExistente.username === username) {
                return res.status(HTTP_STATUS.BAD_REQUEST).json(
                    formatErrorResponse('El nombre de usuario ya está en uso')
                );
            }
            if (usuarioExistente.email === email) {
                return res.status(HTTP_STATUS.BAD_REQUEST).json(
                    formatErrorResponse('El email ya está en uso')
                );
            }
        }

        // Crear nuevo usuario
        const nuevoUsuario = new User({
            username,
            email,
            password,
            nombre: nombre || '',
            apellido: apellido || '',
            rol: rol || 'user',
            departamento: departamento || '',
            activo: true
        });

        await nuevoUsuario.save();

        // Retornar usuario sin password
        const usuarioCreado = await User.findById(nuevoUsuario._id).select('-password');

        res.status(HTTP_STATUS.CREATED).json(formatSuccessResponse({
            id: usuarioCreado._id,
            username: usuarioCreado.username,
            email: usuarioCreado.email,
            nombre: usuarioCreado.nombre,
            apellido: usuarioCreado.apellido,
            rol: usuarioCreado.rol,
            departamento: usuarioCreado.departamento,
            activo: usuarioCreado.activo,
            createdAt: usuarioCreado.createdAt
        }, 'Usuario creado exitosamente'));

    } catch (err) {
        console.error('Error al crear usuario:', err);

        if (err.code === 11000) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json(
                formatErrorResponse('El username o email ya está en uso')
            );
        }

        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
            formatErrorResponse('Error al crear usuario')
        );
    }
};

/**
 * Eliminar usuario (solo para administradores)
 */
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // No permitir que un usuario se elimine a sí mismo
        if (req.user.userId === id) {
            return res.status(HTTP_STATUS.FORBIDDEN).json(
                formatErrorResponse('No puedes eliminar tu propia cuenta')
            );
        }

        const usuario = await User.findById(id);
        if (!usuario) {
            return res.status(HTTP_STATUS.NOT_FOUND).json(
                formatErrorResponse('Usuario no encontrado')
            );
        }

        await User.findByIdAndDelete(id);

        res.json(formatSuccessResponse(null, 'Usuario eliminado exitosamente'));

    } catch (err) {
        console.error('Error al eliminar usuario:', err);
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
            formatErrorResponse('Error al eliminar usuario')
        );
    }
};

module.exports = {
    getProfile,
    updateProfile,
    changePassword,
    getAllUsers,
    updateUserStatus,
    updateUserRole,
    createUser,
    deleteUser
};
