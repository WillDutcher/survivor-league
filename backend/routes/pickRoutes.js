const express = require('express');
const router = express.Router();
const {
    getPicks,
    getPicksForPlayer,
    createPick,
    updatePick
} = require('../controllers/pickController');

// GET all picks
router.get('/', getPicks);

// GET picks for a specific player
router.get('/:playerId', getPicksForPlayer);

// POST a new pick
router.post('/', createPick);

// PATCH to update a pick's status
router.patch('/:pickId', updatePick);

module.exports = router;