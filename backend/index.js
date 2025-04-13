const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// Import and mount the player routes
const playerRoutes = require('./routes/playerRoutes');
app.use('/api/players', playerRoutes);

// Test message
app.get('/', (req, res) => {
    res.send(`Survivor League backend is running!`)
});

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
})