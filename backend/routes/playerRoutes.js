const express = require('express');
const router = express.Router();
const { getPlayers, createPlayer } = require('../controllers/playerController');
// const { abc } = require('../controllers/playerController');

// Test route
// router.get('/', (req, res) => {
//     res.json({ message: 'Player route is working as expected.'});
// });

router.get('/', getPlayers);
router.post('/', createPlayer);
// router.get('/abc', abc);

module.exports = router;