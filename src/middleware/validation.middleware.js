// Middleware para validación de datos de entrada
const { formatErrorResponse } = require('../utils/helpers');
const { HTTP_STATUS } = require('../utils/constants');

const validarTemperatura = (req, res, next) => {
    const { temperatura, fecha_hora } = req.body;
    const errores = [];

    // Validar temperatura
    if (temperatura === undefined || temperatura === null) {
        errores.push('La temperatura es obligatoria');
    } else if (typeof temperatura !== 'number' || isNaN(temperatura)) {
        errores.push('La temperatura debe ser un número válido');
    } else if (temperatura < -50 || temperatura > 150) {
        errores.push('La temperatura debe estar entre -50°C y 150°C');
    }

    // Validar fecha_hora
    if (fecha_hora) {
        const fecha = new Date(fecha_hora);
        if (isNaN(fecha.getTime())) {
            errores.push('La fecha debe ser válida');
        } else if (fecha > new Date()) {
            errores.push('La fecha no puede ser futura');
        }
    }

    // Validar almacenamiento si se proporciona
    if (req.body.almacenamiento !== undefined) {
        const almacenamiento = req.body.almacenamiento;
        if (typeof almacenamiento !== 'number' || isNaN(almacenamiento)) {
            errores.push('El almacenamiento debe ser un número válido');
        } else if (almacenamiento < 0 || almacenamiento > 100) {
            errores.push('El almacenamiento debe estar entre 0 y 100');
        }
    }

    if (errores.length > 0) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json(
            formatErrorResponse('Datos de entrada inválidos', errores)
        );
    }

    next();
};

const validarUsuario = (req, res, next) => {
    const { username, email, password } = req.body;
    const errores = [];

    console.log('=== VALIDACIÓN USUARIO DEBUG ===');
    console.log('Datos recibidos en validación:', { username, email, password: password ? '***' : 'undefined' });
    console.log('Username length:', username ? username.length : 'undefined');
    console.log('Email valid:', email ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) : 'undefined');
    console.log('Password length:', password ? password.length : 'undefined');

    // Validar username
    if (!username || username.trim().length < 3) {
        errores.push('El nombre de usuario debe tener al menos 3 caracteres');
        console.log('Error: Username inválido');
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        errores.push('El email debe ser válido');
        console.log('Error: Email inválido');
    }

    // Validar password
    if (!password || password.length < 6) {
        errores.push('La contraseña debe tener al menos 6 caracteres');
        console.log('Error: Password inválido');
    }

    console.log('Errores encontrados:', errores);

    if (errores.length > 0) {
        console.log('Enviando error 400 con errores:', errores);
        return res.status(HTTP_STATUS.BAD_REQUEST).json(
            formatErrorResponse('Datos de usuario inválidos', errores)
        );
    }

    console.log('Validación exitosa, continuando...');
    next();
};

const validarProyecto = (req, res, next) => {
    const { nombre, descripcion } = req.body;
    const errores = [];

    // Validar nombre
    if (!nombre || nombre.trim().length < 3) {
        errores.push('El nombre del proyecto debe tener al menos 3 caracteres');
    }

    // Validar descripción
    if (!descripcion || descripcion.trim().length < 10) {
        errores.push('La descripción debe tener al menos 10 caracteres');
    }

    if (errores.length > 0) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json(
            formatErrorResponse('Datos de proyecto inválidos', errores)
        );
    }

    next();
};

module.exports = {
    validarTemperatura,
    validarUsuario,
    validarProyecto
};
