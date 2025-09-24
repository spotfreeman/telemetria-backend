// Archivo de ejemplo de configuración
// Copia este archivo como .env y configura tus valores

module.exports = {
    // Configuración de la Base de Datos
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/telemetria',

    // Configuración del Servidor
    PORT: process.env.PORT || 3000,
    NODE_ENV: process.env.NODE_ENV || 'development',

    // Configuración de JWT
    JWT_SECRET: process.env.JWT_SECRET || 'tu_clave_secreta_muy_segura_aqui_cambiar_en_produccion',

    // Configuración de CORS
    CORS_ORIGIN: process.env.CORS_ORIGIN || 'https://telemetria-frontend.onrender.com',

    // Configuración de Email (opcional)
    EMAIL_HOST: process.env.EMAIL_HOST || 'smtp.gmail.com',
    EMAIL_PORT: process.env.EMAIL_PORT || 587,
    EMAIL_USER: process.env.EMAIL_USER || '',
    EMAIL_PASS: process.env.EMAIL_PASS || '',

    // Configuración de Archivos
    MAX_FILE_SIZE: process.env.MAX_FILE_SIZE || 10485760, // 10MB
    UPLOAD_PATH: process.env.UPLOAD_PATH || './uploads',

    // Configuración de ESP32
    ESP32_API_KEY: process.env.ESP32_API_KEY || 'tu_api_key_para_esp32',

    // Configuración de Alertas
    ALERT_TEMPERATURE_MAX: process.env.ALERT_TEMPERATURE_MAX || 40,
    ALERT_TEMPERATURE_MIN: process.env.ALERT_TEMPERATURE_MIN || 0,
    ALERT_HUMIDITY_MAX: process.env.ALERT_HUMIDITY_MAX || 80,
    ALERT_HUMIDITY_MIN: process.env.ALERT_HUMIDITY_MIN || 20
};


