// Constantes del sistema

const USER_ROLES = {
    USER: 'usuario',
    ADMIN: 'admin',
    SUPERVISOR: 'supervisor',
    MONITOR: 'monitor',
    VIEWER: 'visor'
};

const AIR_QUALITY = {
    EXCELLENT: 'excelente',
    GOOD: 'buena',
    MODERATE: 'moderada',
    BAD: 'mala',
    VERY_BAD: 'muy_mala'
};

const DEVICE_STATUS = {
    ONLINE: 'online',
    OFFLINE: 'offline',
    ERROR: 'error'
};

const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500
};

const PAGINATION = {
    DEFAULT_LIMIT: 50,
    MAX_LIMIT: 100,
    DEFAULT_OFFSET: 0
};

const TEMPERATURE_LIMITS = {
    MIN: -50,
    MAX: 150,
    ALERT_MIN: 0,
    ALERT_MAX: 40
};

const HUMIDITY_LIMITS = {
    MIN: 0,
    MAX: 100,
    ALERT_MIN: 20,
    ALERT_MAX: 80
};

module.exports = {
    USER_ROLES,
    AIR_QUALITY,
    DEVICE_STATUS,
    HTTP_STATUS,
    PAGINATION,
    TEMPERATURE_LIMITS,
    HUMIDITY_LIMITS
};
