const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Import and mount the player routes
const playerRoutes = require('./routes/playerRoutes');
app.use('/api/players', playerRoutes);

// Import and mount the pick routes
const pickRoutes = require('./routes/pickRoutes');
app.use('/api/picks', pickRoutes);

const authRoutes = require('./routes/authRoutes');
app.use('/api', authRoutes);

module.exports = app;