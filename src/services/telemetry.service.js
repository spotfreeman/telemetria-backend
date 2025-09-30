const Temperature = require('../models/Temperature');
const ESP32 = require('../models/ESP32');
const { calculateStats, shouldAlertTemperature } = require('../utils/helpers');

/**
 * Servicio para lógica de negocio de telemetría
 */
class TelemetryService {

    /**
     * Procesar datos de temperatura y determinar alertas
     */
    static async processTemperatureData(data) {
        const { temperatura, dispositivo_id, ubicacion } = data;

        // Determinar si requiere alerta
        const alerta = shouldAlertTemperature(temperatura);

        // Determinar calidad del aire basada en temperatura
        let calidad_aire = 'buena';
        if (temperatura < 0 || temperatura > 35) {
            calidad_aire = 'mala';
        } else if (temperatura < 5 || temperatura > 30) {
            calidad_aire = 'moderada';
        }

        return {
            ...data,
            alerta,
            calidad_aire,
            procesadoEn: new Date()
        };
    }

    /**
     * Obtener estadísticas de temperatura por dispositivo
     */
    static async getDeviceStats(deviceId, fecha_inicio, fecha_fin) {
        let query = { dispositivo_id: deviceId };

        if (fecha_inicio || fecha_fin) {
            query.fecha_hora = {};
            if (fecha_inicio) query.fecha_hora.$gte = new Date(fecha_inicio);
            if (fecha_fin) query.fecha_hora.$lte = new Date(fecha_fin);
        }

        const temperatures = await Temperature.find(query).select('temperatura alerta');
        const tempValues = temperatures.map(t => t.temperatura);
        const alertCount = temperatures.filter(t => t.alerta).length;

        return {
            ...calculateStats(tempValues),
            alertas: alertCount,
            totalRegistros: temperatures.length
        };
    }

    /**
     * Obtener dispositivos con alertas activas
     */
    static async getDevicesWithAlerts() {
        const devices = await Temperature.aggregate([
            { $match: { alerta: true } },
            {
                $group: {
                    _id: '$dispositivo_id',
                    alertas: { $sum: 1 },
                    ultimaAlerta: { $max: '$fecha_hora' },
                    temperaturaMax: { $max: '$temperatura' },
                    temperaturaMin: { $min: '$temperatura' }
                }
            },
            { $sort: { ultimaAlerta: -1 } }
        ]);

        return devices;
    }

    /**
     * Limpiar datos antiguos de temperatura
     */
    static async cleanOldTemperatureData(days = 30) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);

        const result = await Temperature.deleteMany({
            fecha_hora: { $lt: cutoffDate }
        });

        return {
            eliminados: result.deletedCount,
            fechaLimite: cutoffDate
        };
    }

    /**
     * Sincronizar datos ESP32 con temperatura
     */
    static async syncESP32Data(deviceId) {
        const esp32Device = await ESP32.findOne({ deviceId });
        if (!esp32Device) {
            throw new Error('Dispositivo ESP32 no encontrado');
        }

        // Obtener datos recientes del ESP32
        const recentData = esp32Device.datas
            .filter(data => {
                const dataDate = new Date(data.timestamp);
                const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
                return dataDate > oneHourAgo;
            })
            .slice(-10); // Últimos 10 registros

        // Crear registros de temperatura
        const temperatureRecords = recentData.map(data => ({
            fecha_hora: data.timestamp,
            temperatura: data.temperature,
            dispositivo_id: deviceId,
            ubicacion: data.location || esp32Device.location,
            humedad: data.humidity,
            presion: data.pressure
        }));

        if (temperatureRecords.length > 0) {
            await Temperature.insertMany(temperatureRecords);
        }

        return {
            sincronizados: temperatureRecords.length,
            dispositivo: deviceId
        };
    }

    /**
     * Obtener resumen de salud del sistema
     */
    static async getSystemHealth() {
        const [
            totalTemperatures,
            totalDevices,
            activeAlerts,
            recentData
        ] = await Promise.all([
            Temperature.countDocuments(),
            Temperature.distinct('dispositivo_id').then(devices => devices.length),
            Temperature.countDocuments({ alerta: true }),
            Temperature.countDocuments({
                fecha_hora: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
            })
        ]);

        return {
            totalTemperatures,
            totalDevices,
            activeAlerts,
            recentData24h: recentData,
            healthStatus: activeAlerts > 10 ? 'warning' : 'healthy'
        };
    }
}

module.exports = TelemetryService;



