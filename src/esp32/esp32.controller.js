const Esp32 = require('./esp32.model');

exports.getAll = async (req, res) => {
    try {
        const allEsp32 = await Esp32.find();
        res.json(allEsp32);
    } catch (err) {
        console.error('Error al obtener dispositivos ESP32:', err);
        res.status(500).json({ error: 'Error al obtener dispositivos ESP32' });
    }
}

exports.create = async (req, res) => {
    try {
        const newEsp32 = new Esp32(req.body);
        await newEsp32.save();
        res.status(201).json(newEsp32);
    } catch (err) {
        console.error('Error al crear el dispositivo ESP32:', err);
        res.status(500).json({ error: 'Error al crear el dispositivo ESP32' });
    }
}

exports.delete = async (req, res) => {
    try {
        const deletedEsp32 = await Esp32.findByIdAndDelete(req.params.id);
        if (!deletedEsp32) {
            return res.status(404).json({ error: 'Dispositivo ESP32 no encontrado' });
        }
        res.json({ message: 'Dispositivo ESP32 eliminado' });
    } catch (err) {
        console.error('Error al eliminar el dispositivo ESP32:', err);
        res.status(500).json({ error: 'Error al eliminar el dispositivo ESP32' });
    }
}

