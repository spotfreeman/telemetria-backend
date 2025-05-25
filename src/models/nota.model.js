const mongoose = require('mongoose');
const notasSchema = new mongoose.Schema({
    fecha_hora: { type: Date, required: true },
    titulo: { type: String, required: true },
    descripcion: { type: String, required: true },
    usuario: { type: String, required: true },
}, { versionKey: false });

module.exports = mongoose.model('nota', notasSchema, 'notas'); // 'notas' is the collection name
