const mongoose = require('mongoose');

const proyectoSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    codigo: { type: String, required: true },
    descripcion: { type: String },
    estado: { type: String },
    pagos: [{
        fecha_hora: { type: Date },
        monto: { type: Number },
        descripcion: { type: String }
    }],
    avance: [{
        mes: { type: Number },
        anio: { type: Number },
        valor: { type: Number }
    }],



}, { versionKey: false });

module.exports = mongoose.model('proyecto', proyectoSchema, 'proyectos'); // 'proyectos' is the collection name