const mongoose = require('mongoose');
const { AIR_QUALITY, TEMPERATURE_LIMITS, HUMIDITY_LIMITS } = require('../utils/constants');

const temperatureSchema = new mongoose.Schema({
    fecha_hora: {
        type: Date,
        required: true,
        default: Date.now
    },
    temperatura: {
        type: Number,
        required: true,
        min: TEMPERATURE_LIMITS.MIN,
        max: TEMPERATURE_LIMITS.MAX
    },
    almacenamiento: {
        type: Number,
        min: 0,
        max: 100
    },
    dispositivo_id: {
        type: String,
        trim: true,
        required: true
    },
    ubicacion: {
        type: String,
        trim: true,
        maxlength: 100
    },
    humedad: {
        type: Number,
        min: HUMIDITY_LIMITS.MIN,
        max: HUMIDITY_LIMITS.MAX
    },
    presion: {
        type: Number,
        min: 0
    },
    calidad_aire: {
        type: String,
        enum: Object.values(AIR_QUALITY),
        default: AIR_QUALITY.GOOD
    },
    alerta: {
        type: Boolean,
        default: false
    },
    observaciones: {
        type: String,
        trim: true,
        maxlength: 500
    },
    usuario_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    versionKey: false,
    timestamps: true
});

// Middleware para establecer alerta automáticamente
temperatureSchema.pre('save', function (next) {
    if (this.temperatura < TEMPERATURE_LIMITS.ALERT_MIN ||
        this.temperatura > TEMPERATURE_LIMITS.ALERT_MAX) {
        this.alerta = true;
    }
    next();
});

// Índices para mejorar el rendimiento de las consultas
temperatureSchema.index({ fecha_hora: -1 });
temperatureSchema.index({ dispositivo_id: 1, fecha_hora: -1 });
temperatureSchema.index({ temperatura: 1 });
temperatureSchema.index({ alerta: 1 });
temperatureSchema.index({ ubicacion: 1 });

module.exports = mongoose.model('Temperature', temperatureSchema);