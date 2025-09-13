const mongoose = require('mongoose');
const { DEVICE_STATUS } = require('../utils/constants');

const esp32Schema = new mongoose.Schema({
    deviceId: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    datas: [{
        timestamp: {
            type: Date,
            required: true,
            default: Date.now
        },
        temperature: {
            type: Number,
            required: true,
            min: -50,
            max: 150
        },
        humidity: {
            type: Number,
            min: 0,
            max: 100
        },
        pressure: {
            type: Number,
            min: 0
        },
        location: {
            type: String,
            trim: true
        }
    }],
    lastUpdate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: Object.values(DEVICE_STATUS),
        default: DEVICE_STATUS.ONLINE
    },
    location: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true,
        maxlength: 200
    }
}, {
    versionKey: false,
    timestamps: true
});

// Índices para mejorar el rendimiento (deviceId ya tiene unique: true)
esp32Schema.index({ lastUpdate: -1 });
esp32Schema.index({ status: 1 });
esp32Schema.index({ 'datas.timestamp': -1 });

module.exports = mongoose.model('ESP32', esp32Schema, 'esp32_data');
