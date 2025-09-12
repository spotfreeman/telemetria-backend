const jwt = require('jsonwebtoken');

function verificarToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ mensaje: 'Token no proporcionado' });
    }
    try {
        const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
        req.user = decoded; // Cambiar a req.user para consistencia
        next();
    } catch (error) {
        res.status(401).json({ mensaje: 'Token inválido' });
    }
}

module.exports = verificarToken;