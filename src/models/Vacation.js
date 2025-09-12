const mongoose = require('mongoose');

const VacacionesSchema = new mongoose.Schema({
    usuario: { type: String, required: true }, // nombre o email del usuario
    desde: { type: Date, required: true },
    hasta: { type: Date, required: true },
    motivo: { type: String },
    creadoEn: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Vacaciones', VacacionesSchema);