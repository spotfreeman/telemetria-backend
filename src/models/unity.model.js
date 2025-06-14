const mongoose = require('mongoose');

const unitySchema = new mongoose.Schema({
    user: { type: String, required: true },
    password: { type: String, required: true },
    level: { type: Number },
    coin: { type: Number }
}, { versionKey: false });
module.exports = mongoose.model('Unity', unitySchema, 'unitys');