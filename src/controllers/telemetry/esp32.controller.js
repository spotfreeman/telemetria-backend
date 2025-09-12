const ESP32 = require('../../models/ESP32');

exports.post = async (req, res) => {
    try {
        const { deviceId, datas, apiKey } = req.body;

        // Validar API key si está configurada
        if (process.env.ESP32_API_KEY && apiKey !== process.env.ESP32_API_KEY) {
            return res.status(401).json({ error: 'API key inválida' });
        }

        // Validar datos requeridos
        if (!deviceId || !datas || !Array.isArray(datas)) {
            return res.status(400).json({
                error: 'Datos inválidos',
                mensaje: 'deviceId y datas (array) son requeridos'
            });
        }

        // Validar que cada dato tenga la estructura correcta
        for (const data of datas) {
            if (!data.timestamp || data.temperature === undefined) {
                return res.status(400).json({
                    error: 'Datos inválidos',
                    mensaje: 'Cada dato debe tener timestamp y temperature'
                });
            }
        }

        // Actualiza el documento existente o crea uno nuevo si no existe
        const doc = await ESP32.findOneAndUpdate(
            { deviceId },
            {
                $push: { datas: { $each: datas } },
                $set: {
                    lastUpdate: new Date(),
                    status: 'online'
                }
            },
            { upsert: true, new: true }
        );

        res.json({
            message: 'Información recibida con éxito',
            deviceId: doc.deviceId,
            totalDatas: doc.datas.length
        });
    } catch (err) {
        console.error('Error al procesar datos ESP32:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

exports.get = async (req, res) => {
    try {
        const { limit = 50, offset = 0, status } = req.query;
        let query = {};

        if (status) {
            query.status = status;
        }

        const allEsp32 = await ESP32.find(query)
            .sort({ lastUpdate: -1 })
            .limit(parseInt(limit))
            .skip(parseInt(offset))
            .select('-datas'); // Excluir los datos para mejorar el rendimiento

        const total = await ESP32.countDocuments(query);

        res.json({
            dispositivos: allEsp32,
            total,
            limit: parseInt(limit),
            offset: parseInt(offset)
        });
    } catch (err) {
        console.error('Error al obtener dispositivos ESP32:', err);
        res.status(500).json({ error: 'Error al obtener dispositivos ESP32' });
    }
}

exports.getAll = async (req, res) => {
    try {
        const device = await ESP32.findOne({ deviceId: req.params.deviceId });
        if (!device) {
            return res.status(404).json({ error: 'No se encontró el dispositivo', datas: [] });
        }
        // Asegura que datas siempre sea un array
        res.json({
            ...device.toObject(),
            datas: Array.isArray(device.datas) ? device.datas : []
        });
    } catch (err) {
        console.error('Error al obtener dispositivo ESP32:', err);
        res.status(500).json({ error: 'Error al obtener dispositivo ESP32', datas: [] });
    }
}


exports.delete = async (req, res) => {
    try {
        const deletedEsp32 = await ESP32.findByIdAndDelete(req.params.id);
        if (!deletedEsp32) {
            return res.status(404).json({ error: 'Dispositivo ESP32 no encontrado' });
        }
        res.json({ message: 'Dispositivo ESP32 eliminado' });
    } catch (err) {
        console.error('Error al eliminar el dispositivo ESP32:', err);
        res.status(500).json({ error: 'Error al eliminar el dispositivo ESP32' });
    }
}

// Obtener estadísticas de un dispositivo específico
exports.getStats = async (req, res) => {
    try {
        const { deviceId } = req.params;
        const { fecha_inicio, fecha_fin } = req.query;

        let matchQuery = { deviceId };

        if (fecha_inicio || fecha_fin) {
            matchQuery['datas.timestamp'] = {};
            if (fecha_inicio) matchQuery['datas.timestamp'].$gte = new Date(fecha_inicio);
            if (fecha_fin) matchQuery['datas.timestamp'].$lte = new Date(fecha_fin);
        }

        const device = await ESP32.findOne({ deviceId });
        if (!device) {
            return res.status(404).json({ error: 'Dispositivo no encontrado' });
        }

        // Filtrar datos por fecha si se especifica
        let filteredDatas = device.datas;
        if (fecha_inicio || fecha_fin) {
            filteredDatas = device.datas.filter(data => {
                const dataDate = new Date(data.timestamp);
                if (fecha_inicio && dataDate < new Date(fecha_inicio)) return false;
                if (fecha_fin && dataDate > new Date(fecha_fin)) return false;
                return true;
            });
        }

        // Calcular estadísticas
        const temperatures = filteredDatas.map(d => d.temperature);
        const stats = {
            total: temperatures.length,
            promedio: temperatures.length > 0 ? temperatures.reduce((a, b) => a + b, 0) / temperatures.length : 0,
            maximo: temperatures.length > 0 ? Math.max(...temperatures) : 0,
            minimo: temperatures.length > 0 ? Math.min(...temperatures) : 0,
            ultimaActualizacion: device.lastUpdate,
            status: device.status
        };

        res.json(stats);
    } catch (err) {
        console.error('Error al obtener estadísticas del dispositivo:', err);
        res.status(500).json({ error: 'Error al obtener estadísticas del dispositivo' });
    }
}

// Limpiar datos antiguos de un dispositivo
exports.cleanOldData = async (req, res) => {
    try {
        const { deviceId } = req.params;
        const { days = 30 } = req.query;

        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - parseInt(days));

        const result = await ESP32.updateOne(
            { deviceId },
            {
                $pull: {
                    datas: {
                        timestamp: { $lt: cutoffDate }
                    }
                }
            }
        );

        res.json({
            message: `Datos anteriores a ${days} días eliminados`,
            modifiedCount: result.modifiedCount
        });
    } catch (err) {
        console.error('Error al limpiar datos antiguos:', err);
        res.status(500).json({ error: 'Error al limpiar datos antiguos' });
    }
}
