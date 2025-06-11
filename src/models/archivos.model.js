const mongoose = require('mongoose');

const archivosSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    tipo: { type: String },
    fecha_creacion: { type: Date, default: Date.now },
    usuario: { type: String },
    link: { type: String, required: true },
    descripcion: { type: String },

}, { versionKey: false });
module.exports = mongoose.model('archivo', archivosSchema, 'archivos'); // 'archivos' is the collection name