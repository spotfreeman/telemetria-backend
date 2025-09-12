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
        const { nombre, apellido, email, departamento } = req.body;

        const updateData = {};
        if (nombre !== undefined) updateData.nombre = nombre;
        if (apellido !== undefined) updateData.apellido = apellido;
        if (email !== undefined) updateData.email = email;
        if (departamento !== undefined) updateData.departamento = departamento;

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

module.exports = {
    getProfile,
    updateProfile,
    changePassword,
    getAllUsers,
    updateUserStatus
};
