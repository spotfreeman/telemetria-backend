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
    detalledelmes: [{
        mes: { type: Number },
        anio: { type: Number },
        descripcion: { type: String }
    }],
    fechas: [{
        fechainicio: { type: Date },
        fechafin: { type: Date },
        aumento: { type: Number },
        fechaactualizada: { type: Date }
    }],




}, { versionKey: false });

// Middleware para calcular fechaactualizada antes de guardar
proyectoSchema.pre('save', function (next) {
    this.fechas.forEach(f => {
        if (f.fechafin && f.aumento !== undefined) {
            const nuevaFecha = new Date(f.fechafin);
            nuevaFecha.setDate(nuevaFecha.getDate() + f.aumento);
            f.fechaactualizada = nuevaFecha;
        }
    });
    next();
});

proyectoSchema.pre('findOneAndUpdate', function (next) {
    const update = this.getUpdate();
    if (update.fechas) {
        update.fechas.forEach(f => {
            if (f.fechafin && f.aumento !== undefined) {
                const nuevaFecha = new Date(f.fechafin);
                nuevaFecha.setDate(nuevaFecha.getDate() + f.aumento);
                f.fechaactualizada = nuevaFecha;
            }
        });
    }
    next();
});

module.exports = mongoose.model('proyecto', proyectoSchema, 'proyectos'); // 'proyectos' is the collection name