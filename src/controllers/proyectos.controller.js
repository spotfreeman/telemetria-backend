const proyectos = require('../models/proyecto.model');

exports.getAll = async (req, res) => {
    try {
        const allProyectos = await proyectos.find();
        res.json(allProyectos);
    } catch (err) {
        console.error('Error al obtener proyectos:', err);
        res.status(500).json({ error: 'Error al obtener proyectos' });
    }
}
exports.getById = async (req, res) => {
    try {
        const proyecto = await proyectos.findById(req.params.id);
        if (!proyecto) {
            return res.status(404).json({ error: 'Proyecto no encontrado' });
        }
        res.json(proyecto);
    } catch (err) {
        console.error('Error al obtener el proyecto:', err);
        res.status(500).json({ error: 'Error al obtener el proyecto' });
    }
}
exports.create = async (req, res) => {
    try {
        const newProyecto = new proyectos(req.body);
        await newProyecto.save();
        res.status(201).json(newProyecto);
    } catch (err) {
        console.error('Error al crear el proyecto:', err);
        res.status(500).json({ error: 'Error al crear el proyecto' });
    }
}
exports.update = async (req, res) => {
    try {
        const updatedProyecto = await proyectos.findByIdAndUpdate(req.params
            .id, req.body, { new: true });
        if (!updatedProyecto) {
            return res.status(404).json({ error: 'Proyecto no encontrado' });
        }
        res.json(updatedProyecto);
    }
    catch (err) {
        console.error('Error al actualizar el proyecto:', err);
        res.status(500).json({ error: 'Error al actualizar el proyecto' });
    }
}
exports.delete = async (req, res) => {
    try {
        const deletedProyecto = await proyectos.findByIdAndDelete(req.params.id);
        if (!deletedProyecto) {
            return res.status(404).json({ error: 'Proyecto no encontrado' });
        }
        res.json({ message: 'Proyecto eliminado' });
    } catch (err) {
        console.error('Error al eliminar el proyecto:', err);
        res.status(500).json({ error: 'Error al eliminar el proyecto' });
    }
}
// Exportar el controlador
module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: deleteProyecto
};
