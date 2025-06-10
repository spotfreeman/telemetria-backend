const mongoose = require('mongoose');

const proyectoSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    codigo: { type: String, required: true },
    descripcion: { type: String },
    estado: { type: String },
    pagos: [{
        mes: { type: Number },
        monto: { type: Number },
        valor: { type: Number }
    }],
    avance: [{
        mes: { type: Number },
        anio: { type: Number },
        valor: { type: Number }
    }],
    programado: [{
        mes: { type: Number },
        anio: { type: Number },
        valor: { type: Number }
    }],
    georeferencia: {
        latitud: { type: Number },
        longitud: { type: Number }
    },



}, { versionKey: false });

module.exports = mongoose.model('proyecto', proyectoSchema, 'proyectos'); // 'proyectos' is the collection name