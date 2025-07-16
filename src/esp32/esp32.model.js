const mongoose = require('mongoose');

const esp32Schema = new mongoose.Schema({
    deviceId: { type: String, required: true, unique: true },
    datas: [{
        timestamp: { type: Date, default: Date.now },
        temperature: { type: Number },
        humidity: { type: Number },
    }]

}, { versionKey: false });

module.exports = mongoose.model('Esp32', esp32Schema, 'esp32_data'); // 'esp32_data' is the collection name
