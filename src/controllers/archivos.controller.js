const archivos = require('../models/archivos.model');

exports.getAll = async (req, res) => {
    try {
        const allArchivos = await archivos.find();
        res.json(allArchivos);
    } catch (err) {
        console.error('Error al obtener archivos:', err);
        res.status(500).json({ error: 'Error al obtener archivos' });
    }
}
exports.getById = async (req, res) => {
    try {
        const archivo = await archivos.findById(req.params.id);
        if (!archivo) {
            return res.status(404).json({ error: 'Archivo no encontrado' });
        }
        res.json(archivo);
    } catch (err) {
        console.error('Error al obtener el archivo:', err);
        res.status(500).json({ error: 'Error al obtener el archivo' });
    }
}
exports.create = async (req, res) => {
    try {
        const newArchivo = new archivos(req.body);
        await newArchivo.save();
        res.status(201).json(newArchivo);
    } catch (err) {
        console.error('Error al crear el archivo:', err);
        res.status(500).json({ error: 'Error al crear el archivo' });
    }
}
exports.update = async (req, res) => {
    try {
        const updatedArchivo = await archivos.findByIdAndUpdate(req.params
            .id, req.body, { new: true });
        if (!updatedArchivo) {
            return res.status(404).json({ error: 'Archivo no encontrado' });
        }
        res.json(updatedArchivo);
    }
    catch (err) {
        console.error('Error al actualizar el archivo:', err);
        res.status(500).json({ error: 'Error al actualizar el archivo' });
    }
}
exports.delete = async (req, res) => {
    try {
        const deletedArchivo = await archivos.findByIdAndDelete(req.params.id);
        if (!deletedArchivo) {
            return res.status(404).json({ error: 'Archivo no encontrado' });
        }
        res.json({ message: 'Archivo eliminado' });
    } catch (err) {
        console.error('Error al eliminar el archivo:', err);
        res.status(500).json({ error: 'Error al eliminar el archivo' });
    }
}
// Exportar el controlador