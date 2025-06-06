const mongoose = require('mongoose');

const proyectoSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    codigo: { type: String, required: true },
    descripcion: { type: String, required: true },
    estado: { type: String, required: true },
    pagos: [{
        fecha_hora: { type: Date, required: true },
        monto: { type: Number, required: true },
        descripcion: { type: String, required: true }
    }],
    avance: [{
        fecha_hora: { type: Date, required: true },
        porcentaje: { type: Number, required: true },
        descripcion: { type: String, required: true }
    }],



}, { versionKey: false });

module.exports = mongoose.model('proyecto', proyectoSchema, 'proyectos'); // 'proyectos' is the collection name