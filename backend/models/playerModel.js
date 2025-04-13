// Fake db of players (to be replaced at a later time)
let players = [];

// Add a new player (will test later)
const addPlayer = ({
                       firstName,
                       lastName,
                       email,
                       passwordHash,
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
        passwordHash,
        plan,
        phone: phone?.trim() || null,
        paypalEmail: paypalEmail?.trim().toLowerCase() || null,
        isAdmin: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    players.push(player);
    return player;
};

// Return all players
const getAllPlayers = () => {
    return players;
};

const getPlayerById = (id) => players.find((p) => p.id === parseInt(id));

const deletePlayer = (id) => {
    const index = players.findIndex(p => p.id === parseInt(id));
    if (index !== -1) {
        return players.splice(index, 1)[0];
    }
    return null;
};

module.exports = {
    getAllPlayers,
    addPlayer,
    getPlayerById,
    deletePlayer
}