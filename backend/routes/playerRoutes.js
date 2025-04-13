const express = require('express');
const router = express.Router();

// Test route
router.get('/', (req, res) => {
    res.json({ message: 'Player route is working as expected.'});
});

module.exports = router;