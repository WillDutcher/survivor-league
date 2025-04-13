const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'default_dev_secret';

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Missing or invalid token' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Token is invalid or expired' });
        }

        req.user = user; // Includes playerId and isAdmin
        next();
    });
}

function requireAdmin(req, res, next) {
    if (!req.user?.isAdmin) {
        return res.status(403).json({ message: 'Admin privileges required.' });
    }
    next();
}

module.exports = {
    authenticateToken,
    requireAdmin
};
