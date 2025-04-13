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