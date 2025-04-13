const express = require('express');
const router = express.Router();
const {
    getPicks,
    getPicksForPlayer,
    createPick,
    updatePick,
    removePick
} = require('../controllers/pickController');
const { authenticateToken, requireAdmin} = require('../middleware/authMiddleware');
const { getPlayerStats } = require('../utils/gameRules');

// TEMPORARY TEST ROUTE - REMOVE THIS
router.get('/test/stats', (req, res) => {
    const picks = [
        { status: 'win' },
        { status: 'loss' },
        { status: 'tie' },
        { status: 'loss' },
        { status: 'win' },
        { status: 'pending' },
        { status: 'loss' }
    ];

    const stats = getPlayerStats(picks, 'premium');
    res.json(stats);
});

// GET all picks
router.get('/', authenticateToken, getPicks);

// GET picks for a specific player
router.get('/:playerId', authenticateToken, getPicksForPlayer);

/* Protected routes (must be logged in) */

// POST a new pick
router.post('/', authenticateToken, createPick);

// PATCH to update a pick's status
router.patch('/:pickId', authenticateToken, requireAdmin, updatePick);

// DELETE a pick
router.delete('/:pickId', authenticateToken, requireAdmin, removePick);

module.exports = router;