const mongoose = require('mongoose');

const temperaturaSchema = new mongoose.Schema({
    fecha_hora: { type: Date, required: true },
    temperatura: { type: Number, required: true }
}, { versionKey: false });

module.exports = mongoose.model('temperatura', temperaturaSchema, 'temperaturas');