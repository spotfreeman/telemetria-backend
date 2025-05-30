const jwt = require('jsonwebtoken');
const SECRET_KEY = 'miclavesecreta';

function verificarToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ mensaje: 'Token no proporcionado' });
    }
    try {
        const decoded = jwt.verify(token.replace('Bearer ', ''), SECRET_KEY);
        req.usuario = decoded;
        next();
    } catch (error) {
        res.status(401).json({ mensaje: 'Token inválido' });
    }
}

module.exports = verificarToken;