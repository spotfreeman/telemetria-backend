const Temperature = require('../../models/Temperature');
const User = require('../../models/User');
const Project = require('../../models/Project');
const ESP32 = require('../../models/ESP32');
const { formatErrorResponse, formatSuccessResponse, createDateFilters } = require('../../utils/helpers');
const { HTTP_STATUS } = require('../../utils/constants');

/**
 * Obtener estadísticas generales del dashboard
 */
const getStats = async (req, res) => {
    try {
        const { fecha_inicio, fecha_fin } = req.query;
        let matchQuery = createDateFilters(fecha_inicio, fecha_fin);

        // Estadísticas de temperatura
        const tempStats = await Temperature.aggregate([
            { $match: matchQuery },
            {
                $group: {
                    _id: null,
                    promedio: { $avg: '$temperatura' },
                    maximo: { $max: '$temperatura' },
                    minimo: { $min: '$temperatura' },
                    total: { $sum: 1 },
                    alertas: { $sum: { $cond: ['$alerta', 1, 0] } }
                }
            }
        ]);

        // Estadísticas de usuarios
        const userStats = await User.aggregate([
            {
                $group: {
                    _id: '$rol',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Estadísticas de proyectos
        const projectStats = await Project.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                    activos: { $sum: { $cond: ['$activo', 1, 0] } }
                }
            }
        ]);

        // Temperaturas recientes (últimas 10)
        const temperaturasRecientes = await Temperature.find(matchQuery)
            .sort({ fecha_hora: -1 })
            .limit(10)
            .select('fecha_hora temperatura dispositivo_id ubicacion alerta');

        // Dispositivos únicos
        const dispositivos = await Temperature.distinct('dispositivo_id', matchQuery);

        res.json(formatSuccessResponse({
            temperatura: tempStats[0] || { promedio: 0, maximo: 0, minimo: 0, total: 0, alertas: 0 },
            usuarios: userStats,
            proyectos: projectStats[0] || { total: 0, activos: 0 },
            temperaturasRecientes,
            dispositivos: dispositivos.length,
            dispositivosLista: dispositivos
        }));

    } catch (err) {
        console.error('Error al obtener estadísticas del dashboard:', err);
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
            formatErrorResponse('Error al obtener estadísticas del dashboard')
        );
    }
};

/**
 * Obtener gráfico de temperatura por período
 */
const getTemperatureChart = async (req, res) => {
    try {
        const { periodo = 'dia', fecha_inicio, fecha_fin } = req.query;
        let matchQuery = createDateFilters(fecha_inicio, fecha_fin);
        let groupFormat = '%Y-%m-%d';

        // Si no se especifica fecha, usar los últimos 7 días por defecto
        if (!fecha_inicio && !fecha_fin) {
            const fechaLimite = new Date();
            fechaLimite.setDate(fechaLimite.getDate() - 7);
            matchQuery.fecha_hora = { $gte: fechaLimite };
        }

        // Configurar formato de agrupación según el período
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
            { $sort: { _id: 1 } }
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

/**
 * Obtener alertas activas
 */
const getAlerts = async (req, res) => {
    try {
        const alertas = await Temperature.find({ alerta: true })
            .sort({ fecha_hora: -1 })
            .limit(50)
            .select('fecha_hora temperatura dispositivo_id ubicacion observaciones');

        res.json(formatSuccessResponse({
            total: alertas.length,
            alertas
        }));

    } catch (err) {
        console.error('Error al obtener alertas:', err);
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
            formatErrorResponse('Error al obtener alertas')
        );
    }
};

module.exports = {
    getStats,
    getTemperatureChart,
    getAlerts
};
