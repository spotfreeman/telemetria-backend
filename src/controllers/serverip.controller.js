const unityIpServerIp = require('../models/ServerIP');

exports.getAll = async (req, res) => {
    try {
        const ips = await unityIpServerIp.find();
        res.json(ips);
    } catch (err) {
        console.error('Error al obtener IPs:', err);
        res.status(500).json({ error: 'Error al obtener IPs' });
    }
}
