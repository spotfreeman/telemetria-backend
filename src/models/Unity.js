const mongoose = require('mongoose');

const unitySchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    level: { type: Number },
    coins: { type: Number },
    player: [
        {
            nivel: { type: Number },
            experiencia: { type: Number },
            vida: { type: Number },
            ataque: { type: Number },
            defesa: { type: Number },
            magia: { type: Number },
            sorte: { type: Number },
            velocidade: { type: Number },
            inteligencia: { type: Number }
        }],
}, { versionKey: false });

module.exports = mongoose.model('Unity', unitySchema, 'unitys');