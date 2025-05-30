const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const usuariosSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fecha_creacion: { type: Date, default: Date.now },
}, { versionKey: false });

// Middleware para encriptar la contraseña antes de guardar
usuariosSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

module.exports = mongoose.model('usuario', usuariosSchema, 'usuarios');