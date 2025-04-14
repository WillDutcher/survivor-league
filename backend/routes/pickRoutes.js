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

// --- AUTH / STATS - TEMPORARY TEST ROUTE - REMOVE THESE ---
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

const { syncPickResults } = require('../utils/sync');

router.post('/sync', authenticateToken, requireAdmin, (req, res) => {
    const updatedPicks = syncPickResults();
    res.json({
        message: `${updatedPicks.length} picks updated from game results.`,
        picks: updatedPicks
    });
});
// REMOVE ABOVE

// --- PUBLIC / AUTHENTICATED ---
router.get('/', authenticateToken, getPicks);
router.get('/:playerId', authenticateToken, getPicksForPlayer);

// -- MUTATIONS (PROTECTED / ADMIN REQUIRED) ---
router.post('/', authenticateToken, createPick);
router.patch('/:pickId', authenticateToken, requireAdmin, updatePick);
router.delete('/:pickId', authenticateToken, requireAdmin, removePick);

module.exports = router;