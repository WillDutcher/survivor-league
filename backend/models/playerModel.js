// Fake db of players (to be replaced at a later time)
let players = [];

// Add a new player (will test later)
const addPlayer = ({
                       firstName,
                       lastName,
                       email,
                       plan,
                       phone,
                       paypalEmail
                   }) => {
    const id = players.length + 1;

    const player = {
        id,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.toLowerCase(),
        plan,
        phone: phone?.trim() || null,
        paypalEmail: paypalEmail?.trim().toLowerCase() || null,
        createdAt: new Date().toISOString()
    };

    players.push(player);
    return player;
};

// Return all players
const getAllPlayers = () => {
    return players;
};

module.exports = {
    getAllPlayers,
    addPlayer
}