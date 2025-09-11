const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const usuarioSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    nombre: { type: String, trim: true },
    apellido: { type: String, trim: true },
    rol: { type: String, enum: ['usuario', 'admin', 'supervisor', 'monitor', 'visor'], default: 'usuario' },
    departamento: { type: String, trim: true },
    activo: { type: Boolean, default: true },
    creadoEn: { type: Date, default: Date.now }
}, { versionKey: false });

// Hashear contraseña antes de guardar
usuarioSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        this.password = await bcrypt.hash(this.password, 10);
        next();
    } catch (err) {
        next(err);
    }
});

// Método para comparar contraseñas
usuarioSchema.methods.compararPassword = function (password) {
    return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('Usuario', usuarioSchema);