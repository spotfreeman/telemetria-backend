const mongoose = require('mongoose');

const serverIpSchema = new mongoose.Schema({
    fecha_hora: { type: Date, required: true },
    ipexterna: { type: String, required: true },
    descripcion: { type: String },
}, { versionKey: false });
module.exports = mongoose.model('unityIp', serverIpSchema, 'unityIps');