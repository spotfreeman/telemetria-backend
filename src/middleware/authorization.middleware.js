const { formatErrorResponse } = require('../utils/helpers');
const { HTTP_STATUS } = require('../utils/constants');

/**
 * Middleware para verificar que el usuario tenga rol de administrador
 */
const requireAdmin = (req, res, next) => {
    try {
        // Verificar que el usuario esté autenticado (debe venir después de verificarToken)
        if (!req.user) {
            return res.status(HTTP_STATUS.UNAUTHORIZED).json(
                formatErrorResponse('Usuario no autenticado')
            );
        }

        // Verificar que tenga rol de administrador
        if (req.user.rol !== 'admin') {
            return res.status(HTTP_STATUS.FORBIDDEN).json(
                formatErrorResponse('Acceso denegado. Se requiere rol de administrador')
            );
        }

        next();
    } catch (err) {
        console.error('Error en middleware de autorización:', err);
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
            formatErrorResponse('Error de autorización')
        );
    }
};

/**
 * Middleware para verificar múltiples roles
 */
const requireRoles = (...roles) => {
    return (req, res, next) => {
        try {
            // Verificar que el usuario esté autenticado
            if (!req.user) {
                return res.status(HTTP_STATUS.UNAUTHORIZED).json(
                    formatErrorResponse('Usuario no autenticado')
                );
            }

            // Verificar que tenga uno de los roles permitidos
            if (!roles.includes(req.user.rol)) {
                return res.status(HTTP_STATUS.FORBIDDEN).json(
                    formatErrorResponse(`Acceso denegado. Se requiere uno de estos roles: ${roles.join(', ')}`)
                );
            }

            next();
        } catch (err) {
            console.error('Error en middleware de roles:', err);
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
                formatErrorResponse('Error de autorización')
            );
        }
    };
};

module.exports = {
    requireAdmin,
    requireRoles
};
