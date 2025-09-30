// Funciones auxiliares

const { PAGINATION, TEMPERATURE_LIMITS, HUMIDITY_LIMITS } = require('./constants');

/**
 * Valida y normaliza parámetros de paginación
 */
const normalizePagination = (query) => {
    const limit = Math.min(
        parseInt(query.limit) || PAGINATION.DEFAULT_LIMIT,
        PAGINATION.MAX_LIMIT
    );
    const offset = Math.max(parseInt(query.offset) || PAGINATION.DEFAULT_OFFSET, 0);

    return { limit, offset };
};

/**
 * Crea filtros de fecha para consultas
 */
const createDateFilters = (fecha_inicio, fecha_fin) => {
    const filters = {};

    if (fecha_inicio || fecha_fin) {
        filters.fecha_hora = {};
        if (fecha_inicio) filters.fecha_hora.$gte = new Date(fecha_inicio);
        if (fecha_fin) filters.fecha_hora.$lte = new Date(fecha_fin);
    }

    return filters;
};

/**
 * Valida si una temperatura está dentro de los límites
 */
const isValidTemperature = (temperature) => {
    return temperature >= TEMPERATURE_LIMITS.MIN && temperature <= TEMPERATURE_LIMITS.MAX;
};

/**
 * Valida si una humedad está dentro de los límites
 */
const isValidHumidity = (humidity) => {
    return humidity >= HUMIDITY_LIMITS.MIN && humidity <= HUMIDITY_LIMITS.MAX;
};

/**
 * Determina si una temperatura requiere alerta
 */
const shouldAlertTemperature = (temperature) => {
    return temperature < TEMPERATURE_LIMITS.ALERT_MIN || temperature > TEMPERATURE_LIMITS.ALERT_MAX;
};

/**
 * Determina si una humedad requiere alerta
 */
const shouldAlertHumidity = (humidity) => {
    return humidity < HUMIDITY_LIMITS.ALERT_MIN || humidity > HUMIDITY_LIMITS.ALERT_MAX;
};

/**
 * Formatea una respuesta de error
 */
const formatErrorResponse = (message, details = null) => {
    const response = { error: message };
    if (details) response.detalles = details;
    return response;
};

/**
 * Formatea una respuesta de éxito
 */
const formatSuccessResponse = (data, message = null) => {
    const response = { data };
    if (message) response.message = message;
    return response;
};

/**
 * Genera un ID único simple
 */
const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Sanitiza un string para evitar inyecciones
 */
const sanitizeString = (str) => {
    if (typeof str !== 'string') return str;
    return str.trim().replace(/[<>]/g, '');
};

/**
 * Calcula estadísticas básicas de un array de números
 */
const calculateStats = (numbers) => {
    if (!numbers || numbers.length === 0) {
        return { promedio: 0, maximo: 0, minimo: 0, total: 0 };
    }

    const total = numbers.length;
    const promedio = numbers.reduce((a, b) => a + b, 0) / total;
    const maximo = Math.max(...numbers);
    const minimo = Math.min(...numbers);

    return { promedio, maximo, minimo, total };
};

module.exports = {
    normalizePagination,
    createDateFilters,
    isValidTemperature,
    isValidHumidity,
    shouldAlertTemperature,
    shouldAlertHumidity,
    formatErrorResponse,
    formatSuccessResponse,
    generateId,
    sanitizeString,
    calculateStats
};



