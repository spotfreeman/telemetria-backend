const notas = require('../models/nota.model.js');

exports.getAll = async (req, res) => {
    try {
        const allNotas = await notas.find();
        res.json(allNotas);
    } catch (err) {
        console.error('Error al obtener notas:', err);
        res.status(500).json({ error: 'Error al obtener notas' });
    }
}
exports.getById = async (req, res) => {
    try {
        const nota = await notas.findById(req.params.id);
        if (!nota) {
            return res.status(404).json({ error: 'Nota no encontrada' });
        }
        res.json(nota);
    } catch (err) {
        console.error('Error al obtener la nota:', err);
        res.status(500).json({ error: 'Error al obtener la nota' });
    }
}
exports.create = async (req, res) => {
    try {
        const newNota = new notas(req.body);
        await newNota.save();
        res.status(201).json(newNota);
    } catch (err) {
        console.error('Error al crear la nota:', err);
        res.status(500).json({ error: 'Error al crear la nota' });
    }
}
exports.update = async (req, res) => {
    try {
        const updatedNota = await notas.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedNota) {
            return res.status(404).json({ error: 'Nota no encontrada' });
        }
        res.json(updatedNota);
    }
    catch (err) {
        console.error('Error al actualizar la nota:', err);
        res.status(500).json({ error: 'Error al actualizar la nota' });
    }
}
exports.delete = async (req, res) => {
    try {
        const deletedNota = await notas.findByIdAndDelete(req.params.id);
        if (!deletedNota) {
            return res.status(404).json({ error: 'Nota no encontrada' });
        }
        res.json({ message: 'Nota eliminada' });
    } catch (err) {
        console.error('Error al eliminar la nota:', err);
        res.status(500).json({ error: 'Error al eliminar la nota' });
    }
}   
