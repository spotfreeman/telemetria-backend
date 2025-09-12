const mongoose = require('mongoose');

function parseFecha(fecha) {
    if (fecha instanceof Date) return fecha;
    if (typeof fecha === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
        const [anio, mes, dia] = fecha.split('-').map(Number);
        return new Date(anio, mes - 1, dia);
    }
    return new Date(fecha);
}

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
    licitacion: [
        {
            idlicitacion: { type: String },
        }
    ]
}, { versionKey: false });

// Middleware para calcular fechaactualizada antes de guardar
proyectoSchema.pre('save', function (next) {
    this.fechas.forEach(f => {
        if (f.fechainicio) f.fechainicio = parseFecha(f.fechainicio);
        if (f.fechafin) f.fechafin = parseFecha(f.fechafin);
        // Solo calcular fechaactualizada, NO modificar fechafin
        if (f.fechafin && f.aumento !== undefined) {
            const fechaFin = parseFecha(f.fechafin);
            const aumentoDias = Number(f.aumento);
            const fechaActualizada = new Date(fechaFin);
            fechaActualizada.setDate(fechaActualizada.getDate() + aumentoDias);
            f.fechaactualizada = fechaActualizada;
        }
    });
    next();
});

proyectoSchema.pre('findOneAndUpdate', function (next) {
    const update = this.getUpdate();
    if (update.fechas) {
        update.fechas.forEach(f => {
            if (f.fechainicio) f.fechainicio = parseFecha(f.fechainicio);
            if (f.fechafin) f.fechafin = parseFecha(f.fechafin);
            // Solo calcular fechaactualizada, NO modificar fechafin
            if (f.fechafin && f.aumento !== undefined) {
                const fechaFin = parseFecha(f.fechafin);
                const aumentoDias = Number(f.aumento);
                const fechaActualizada = new Date(fechaFin);
                fechaActualizada.setDate(fechaActualizada.getDate() + aumentoDias);
                f.fechaactualizada = fechaActualizada;
            }
        });
    }
    next();
});

module.exports = mongoose.model('proyecto', proyectoSchema, 'proyectos');