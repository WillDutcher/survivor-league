const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { getAllPlayers } = require('../models/playerModel');

const JWT_SECRET = process.env.JWT_SECRET || 'default_dev_secret';

const login = (req, res) => {
    const { email, password } = req.body;

    const player = getAllPlayers().find(p => p.email === email?.toLowerCase());
    if (!player) {
        return res.status(401).json({ message: 'Invalid email or password.' });
    }

    bcrypt.compare(password, player.passwordHash, (err, match) => {
        if (err || !match) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        const token = jwt.sign(
            {
                playerId: player.id,
                isAdmin: player.isAdmin
            },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Login successful',
            token
        });
    });
};

module.exports = { login };
