const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, unique: true },
    nombre: { type: String },
    apellido: { type: String },
    fechaCreacion: { type: Date, default: Date.now },
    rol: { type: String },
    departamento: { type: String },
    activo: { type: Boolean },

}, { versionKey: false });

module.exports = mongoose.model('Usuario', usuarioSchema, 'usuarios');