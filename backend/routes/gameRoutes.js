const express = require('express');
const router = express.Router();
const {
    getGames,
    createGame,
    updateGame
} = require('../controllers/gameController');

const { authenticateToken, requireAdmin } = require('../middleware/authMiddleware');

// Public: Get all games
router.get('/', getGames);

// Protected: Only admins can create games
router.post('/', authenticateToken, requireAdmin, createGame);
router.put('/:id', authenticateToken, requireAdmin, updateGame);

module.exports = router;
