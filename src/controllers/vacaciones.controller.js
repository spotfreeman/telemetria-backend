const vacaciones = require('../models/Vacation');
exports.getAll = async (req, res) => {
    try {
        const allVacaciones = await vacaciones.find();
        res.json(allVacaciones);
    } catch (err) {
        console.error('Error al obtener vacaciones:', err);
        res.status(500).json({ error: 'Error al obtener vacaciones' });
    }
};
exports.getById = async (req, res) => {
    try {
        const vacacionesItem = await vacaciones.findById(req.params.id);
        if (!vacacionesItem) {
            return res.status(404).json({ error: 'Vacaciones no encontradas' });
        }
        res.json(vacacionesItem);
    } catch (err) {
        console.error('Error al obtener las vacaciones:', err);
        res.status(500).json({ error: 'Error al obtener las vacaciones' });
    }
};
exports.create = async (req, res) => {
    try {
        const newVacaciones = new vacaciones(req.body);
        await newVacaciones.save();
        res.status(201).json(newVacaciones);
    } catch (err) {
        console.error('Error al crear las vacaciones:', err);
        res.status(500).json({ error: 'Error al crear las vacaciones' });
    }
};
exports.update = async (req, res) => {
    try {
        const updatedVacaciones = await vacaciones.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedVacaciones) {
            return res.status(404).json({ error: 'Vacaciones no encontradas' });
        }
        res.json(updatedVacaciones);
    }
    catch (err) {
        console.error('Error al actualizar las vacaciones:', err);
        res.status(500).json({ error: 'Error al actualizar las vacaciones' });
    }
}
exports.delete = async (req, res) => {
    try {
        const deletedVacaciones = await vacaciones.findByIdAndDelete(req.params.id);
        if (!deletedVacaciones) {
            return res.status(404).json({ error: 'Vacaciones no encontradas' });
        }
        res.json({ message: 'Vacaciones eliminadas' });
    } catch (err) {
        console.error('Error al eliminar las vacaciones:', err);
        res.status(500).json({ error: 'Error al eliminar las vacaciones' });
    }
}