const Temperature = require('../../models/Temperature');
const {
    formatErrorResponse,
    formatSuccessResponse,
    normalizePagination,
    createDateFilters,
    calculateStats
} = require('../../utils/helpers');
const { HTTP_STATUS } = require('../../utils/constants');

/**
 * Obtener todas las temperaturas con filtros y paginación
 */
const getAll = async (req, res) => {
    try {
        const { limit, offset } = normalizePagination(req.query);
        const { fecha_inicio, fecha_fin, dispositivo_id, ubicacion, alerta } = req.query;

        let query = createDateFilters(fecha_inicio, fecha_fin);

        // Filtros adicionales
        if (dispositivo_id) query.dispositivo_id = dispositivo_id;
        if (ubicacion) query.ubicacion = new RegExp(ubicacion, 'i');
        if (alerta !== undefined) query.alerta = alerta === 'true';

        const temperaturas = await Temperature.find(query)
            .populate('usuario_id', 'username nombre apellido')
            .sort({ fecha_hora: -1 })
            .limit(limit)
            .skip(offset);

        const total = await Temperature.countDocuments(query);

        res.json(formatSuccessResponse({
            temperaturas,
            total,
            limit,
            offset
        }));

    } catch (err) {
        console.error('Error al obtener temperaturas:', err);
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
            formatErrorResponse('Error al obtener temperaturas')
        );
    }
};

/**
 * Obtener temperatura por ID
 */
const getById = async (req, res) => {
    try {
        const temperatura = await Temperature.findById(req.params.id)
            .populate('usuario_id', 'username nombre apellido');

        if (!temperatura) {
            return res.status(HTTP_STATUS.NOT_FOUND).json(
                formatErrorResponse('Temperatura no encontrada')
            );
        }

        res.json(formatSuccessResponse(temperatura));

    } catch (err) {
        console.error('Error al obtener temperatura:', err);
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
            formatErrorResponse('Error al obtener temperatura')
        );
    }
};

/**
 * Crear nueva temperatura
 */
const create = async (req, res) => {
    try {
        const {
            fecha_hora,
            temperatura,
            almacenamiento,
            dispositivo_id,
            ubicacion,
            humedad,
            presion,
            calidad_aire,
            observaciones
        } = req.body;

        // Validar datos requeridos
        if (temperatura === undefined || !dispositivo_id) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json(
                formatErrorResponse('Temperatura y dispositivo_id son obligatorios')
            );
        }

        const nuevaTemperatura = new Temperature({
            fecha_hora: fecha_hora ? new Date(fecha_hora) : new Date(),
            temperatura: parseFloat(temperatura),
            almacenamiento: almacenamiento ? parseFloat(almacenamiento) : undefined,
            dispositivo_id,
            ubicacion,
            humedad: humedad ? parseFloat(humedad) : undefined,
            presion: presion ? parseFloat(presion) : undefined,
            calidad_aire,
            observaciones,
            usuario_id: req.user?.userId
        });

        await nuevaTemperatura.save();

        res.status(HTTP_STATUS.CREATED).json(
            formatSuccessResponse(nuevaTemperatura, 'Temperatura creada exitosamente')
        );

    } catch (err) {
        console.error('Error al crear temperatura:', err);
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
            formatErrorResponse('Error al crear temperatura')
        );
    }
};

/**
 * Actualizar temperatura
 */
const update = async (req, res) => {
    try {
        const {
            fecha_hora,
            temperatura,
            almacenamiento,
            ubicacion,
            humedad,
            presion,
            calidad_aire,
            observaciones
        } = req.body;

        const updateData = {};
        if (fecha_hora) updateData.fecha_hora = new Date(fecha_hora);
        if (temperatura !== undefined) updateData.temperatura = parseFloat(temperatura);
        if (almacenamiento !== undefined) updateData.almacenamiento = parseFloat(almacenamiento);
        if (ubicacion !== undefined) updateData.ubicacion = ubicacion;
        if (humedad !== undefined) updateData.humedad = parseFloat(humedad);
        if (presion !== undefined) updateData.presion = parseFloat(presion);
        if (calidad_aire !== undefined) updateData.calidad_aire = calidad_aire;
        if (observaciones !== undefined) updateData.observaciones = observaciones;

        const temperaturaActualizada = await Temperature.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        ).populate('usuario_id', 'username nombre apellido');

        if (!temperaturaActualizada) {
            return res.status(HTTP_STATUS.NOT_FOUND).json(
                formatErrorResponse('Temperatura no encontrada')
            );
        }

        res.json(formatSuccessResponse(
            temperaturaActualizada,
            'Temperatura actualizada exitosamente'
        ));

    } catch (err) {
        console.error('Error al actualizar temperatura:', err);
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
            formatErrorResponse('Error al actualizar temperatura')
        );
    }
};

/**
 * Eliminar temperatura
 */
const deleteTemperature = async (req, res) => {
    try {
        const temperaturaEliminada = await Temperature.findByIdAndDelete(req.params.id);

        if (!temperaturaEliminada) {
            return res.status(HTTP_STATUS.NOT_FOUND).json(
                formatErrorResponse('Temperatura no encontrada')
            );
        }

        res.json(formatSuccessResponse(null, 'Temperatura eliminada exitosamente'));

    } catch (err) {
        console.error('Error al eliminar temperatura:', err);
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
            formatErrorResponse('Error al eliminar temperatura')
        );
    }
};

/**
 * Obtener estadísticas de temperatura
 */
const getStats = async (req, res) => {
    try {
        const { fecha_inicio, fecha_fin, dispositivo_id, ubicacion } = req.query;
        let matchQuery = createDateFilters(fecha_inicio, fecha_fin);

        if (dispositivo_id) matchQuery.dispositivo_id = dispositivo_id;
        if (ubicacion) matchQuery.ubicacion = new RegExp(ubicacion, 'i');

        const stats = await Temperature.aggregate([
            { $match: matchQuery },
            {
                $group: {
                    _id: null,
                    promedio: { $avg: '$temperatura' },
                    maximo: { $max: '$temperatura' },
                    minimo: { $min: '$temperatura' },
                    total: { $sum: 1 },
                    alertas: { $sum: { $cond: ['$alerta', 1, 0] } },
                    dispositivosUnicos: { $addToSet: '$dispositivo_id' }
                }
            },
            {
                $project: {
                    _id: 0,
                    promedio: { $round: ['$promedio', 2] },
                    maximo: 1,
                    minimo: 1,
                    total: 1,
                    alertas: 1,
                    totalDispositivos: { $size: '$dispositivosUnicos' }
                }
            }
        ]);

        const result = stats[0] || {
            promedio: 0,
            maximo: 0,
            minimo: 0,
            total: 0,
            alertas: 0,
            totalDispositivos: 0
        };

        res.json(formatSuccessResponse(result));

    } catch (err) {
        console.error('Error al obtener estadísticas:', err);
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
            formatErrorResponse('Error al obtener estadísticas')
        );
    }
};

/**
 * Obtener datos para gráficos
 */
const getChartData = async (req, res) => {
    try {
        const { periodo = 'dia', fecha_inicio, fecha_fin, dispositivo_id } = req.query;
        let matchQuery = createDateFilters(fecha_inicio, fecha_fin);

        if (dispositivo_id) matchQuery.dispositivo_id = dispositivo_id;

        let groupFormat = '%Y-%m-%d';
        switch (periodo) {
            case 'hora':
                groupFormat = '%Y-%m-%d %H:00:00';
                break;
            case 'dia':
                groupFormat = '%Y-%m-%d';
                break;
            case 'semana':
                groupFormat = '%Y-%U';
                break;
            case 'mes':
                groupFormat = '%Y-%m';
                break;
        }

        const chartData = await Temperature.aggregate([
            { $match: matchQuery },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: groupFormat,
                            date: '$fecha_hora'
                        }
                    },
                    promedio: { $avg: '$temperatura' },
                    maximo: { $max: '$temperatura' },
                    minimo: { $min: '$temperatura' },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } },
            {
                $project: {
                    _id: 1,
                    promedio: { $round: ['$promedio', 2] },
                    maximo: 1,
                    minimo: 1,
                    count: 1
                }
            }
        ]);

        res.json(formatSuccessResponse({
            periodo,
            datos: chartData
        }));

    } catch (err) {
        console.error('Error al obtener datos del gráfico:', err);
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
            formatErrorResponse('Error al obtener datos del gráfico')
        );
    }
};

module.exports = {
    getAll,
    getById,
    create,
    update,
    deleteTemperature,
    getStats,
    getChartData
};

