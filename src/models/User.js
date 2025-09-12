const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { USER_ROLES } = require('../utils/constants');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 30
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email inválido']
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    nombre: {
        type: String,
        trim: true,
        maxlength: 50
    },
    apellido: {
        type: String,
        trim: true,
        maxlength: 50
    },
    rol: {
        type: String,
        enum: Object.values(USER_ROLES),
        default: USER_ROLES.USER
    },
    departamento: {
        type: String,
        trim: true,
        maxlength: 100
    },
    activo: {
        type: Boolean,
        default: true
    },
    ultimoAcceso: {
        type: Date,
        default: Date.now
    },
    avatar: {
        type: String,
        default: null
    }
}, {
    versionKey: false,
    timestamps: true
});

// Hashear contraseña antes de guardar
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        this.password = await bcrypt.hash(this.password, 10);
        next();
    } catch (err) {
        next(err);
    }
});

// Método para comparar contraseñas
userSchema.methods.compararPassword = function (password) {
    return bcrypt.compare(password, this.password);
};

// Método para obtener el nombre completo
userSchema.virtual('nombreCompleto').get(function () {
    return `${this.nombre || ''} ${this.apellido || ''}`.trim();
});

// Índices para mejorar el rendimiento (email y username ya tienen unique: true)
userSchema.index({ rol: 1 });
userSchema.index({ activo: 1 });

module.exports = mongoose.model('User', userSchema);