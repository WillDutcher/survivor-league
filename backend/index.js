const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// Import and mount the player routes
const playerRoutes = require('./routes/playerRoutes');
app.use('/api/players', playerRoutes);

// Import and mount the pick routes
const pickRoutes = require('./routes/pickRoutes');
app.use('/api/picks', pickRoutes);

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
})