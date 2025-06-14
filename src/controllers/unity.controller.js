const unity = require('../models/unity.model');

exports.getAll = async (req, res) => {
    try {
        const allUnity = await unity.find();
        res.json(allUnity);
    } catch (err) {
        console.error('Error al obtener unidades:', err);
        res.status(500).json({ error: 'Error al obtener unidades' });
    }
}
exports.getById = async (req, res) => {
    try {
        const unityItem = await unity.findById(req.params.id);
        if (!unityItem) {
            return res.status(404).json({ error: 'Unidad no encontrada' });
        }
        res.json(unityItem);
    } catch (err) {
        console.error('Error al obtener la unidad:', err);
        res.status(500).json({ error: 'Error al obtener la unidad' });
    }
};
exports.create = async (req, res) => {
    try {
        const newUnity = new unity(req.body);
        await newUnity.save();
        res.status(201).json(newUnity);
    } catch (err) {
        console.error('Error al crear la unidad:', err);
        res.status(500).json({ error: 'Error al crear la unidad' });
    }
};
exports.update = async (req, res) => {
    try {
        const updatedUnity = await unity.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedUnity) {
            return res.status(404).json({ error: 'Unidad no encontrada' });
        }
        res.json(updatedUnity);
    }
    catch (err) {
        console.error('Error al actualizar la unidad:', err);
        res.status(500).json({ error: 'Error al actualizar la unidad' });
    }
}
exports.delete = async (req, res) => {
    try {
        const deletedUnity = await unity.findByIdAndDelete(req.params.id);
        if (!deletedUnity) {
            return res.status(404).json({ error: 'Unidad no encontrada' });
        }
        res.json({ message: 'Unidad eliminada' });
    } catch (err) {
        console.error('Error al eliminar la unidad:', err);
        res.status(500).json({ error: 'Error al eliminar la unidad' });
    }
}
