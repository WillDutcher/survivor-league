const express = require('express');
const router = express.Router();
const {
    getPlayers,
    createPlayer,
    createAdmin,
    updatePlayer,
    removePlayer,
    promoteToAdmin
} = require('../controllers/playerController');

const {
    authenticateToken,
    requireAdmin
} = require('../middleware/authMiddleware');

// Public registration
router.post('/', createPlayer);

// Temporary dev route for admin creation
router.post('/create-admin', createAdmin);

// Protected routes
router.patch('/:playerId', authenticateToken, updatePlayer);
router.delete('/:playerId', authenticateToken, removePlayer);

// Admin-only routes
router.get('/', authenticateToken, requireAdmin, getPlayers);
router.patch('/:playerId/promote', authenticateToken, requireAdmin, promoteToAdmin);

module.exports = router;
