const Esp32 = require('./esp32.model');

exports.post = async (req, res) => {
    try {
        const { deviceId, datas } = req.body;
        // Puedes guardar como nuevo documento o actualizar uno existente
        const doc = await Esp32.findOneAndUpdate(
            { deviceId },
            { $push: { datas: { $each: datas } } },
            { upsert: true, new: true }
        );
        res.status(200).json(doc);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}




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



