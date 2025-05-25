const mongoose = require('mongoose');

const rpiSchema = new mongoose.Schema({
    fecha_hora: { type: Date, required: true },
    ipinterna: { type: String, required: true },
    ipexterna: { type: String, required: true },
}, { versionKey: false });

module.exports = mongoose.model('serverIp', rpiSchema, 'serverIps');
