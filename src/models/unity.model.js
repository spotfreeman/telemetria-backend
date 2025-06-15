const mongoose = require('mongoose');

const unitySchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    level: { type: Number },
    coins: { type: Number }
}, { versionKey: false });
module.exports = mongoose.model('Unity', unitySchema, 'unitys');