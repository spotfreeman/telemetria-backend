const Temperatura = require('../models/temperatura.model');

// Obtener todas las temperaturas
exports.getAll = async (req, res) => {
    try {
        const temperaturas = await Temperatura.find();
        res.json(temperaturas);
    } catch (err) {
        console.error('Error al obtener temperaturas:', err);
        res.status(500).json({ error: 'Error al obtener temperaturas' });
    }
};

