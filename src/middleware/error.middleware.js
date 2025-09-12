// Middleware para manejo global de errores

const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    // Error de validación de Mongoose
    if (err.name === 'ValidationError') {
        const errores = Object.values(err.errors).map(e => e.message);
        return res.status(400).json({
            error: 'Error de validación',
            detalles: errores
        });
    }

    // Error de duplicado de Mongoose
    if (err.code === 11000) {
        const campo = Object.keys(err.keyValue)[0];
        return res.status(400).json({
            error: 'Dato duplicado',
            mensaje: `El ${campo} ya existe`
        });
    }

    // Error de ObjectId inválido
    if (err.name === 'CastError') {
        return res.status(400).json({
            error: 'ID inválido',
            mensaje: 'El ID proporcionado no es válido'
        });
    }

    // Error de JWT
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            error: 'Token inválido',
            mensaje: 'El token proporcionado no es válido'
        });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            error: 'Token expirado',
            mensaje: 'El token ha expirado, por favor inicia sesión nuevamente'
        });
    }

    // Error por defecto
    res.status(err.status || 500).json({
        error: err.message || 'Error interno del servidor',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

// Middleware para manejar rutas no encontradas
const notFound = (req, res, next) => {
    const error = new Error(`Ruta no encontrada - ${req.originalUrl}`);
    error.status = 404;
    next(error);
};

module.exports = {
    errorHandler,
    notFound
};
