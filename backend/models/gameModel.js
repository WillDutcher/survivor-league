// This will eventually be replaced by a real DB
let games = [];

// Create a new game entry
function addGame({ week, homeTeam, awayTeam, homeScore, awayScore, gameSpread, kickoff }) {
    const id = games.length + 1;

    // Determine winner and loser
    let winner = null;
    let loser = null;
    let score = `${homeScore} - ${awayScore}`;

    if (homeScore > awayScore) {
        winner = homeTeam;
        loser = awayTeam;
    } else if (awayScore > homeScore) {
        winner = awayTeam;
        loser = homeTeam;
    } // else tie = no winner/loser assigned

    const newGame = {
        id,
        week,
        homeTeam,
        awayTeam,
        homeScore,
        awayScore,
        winner,
        loser,
        score,
        gameSpread: gameSpread.toString(),
        kickoff: new Date(kickoff).toISOString()
    };

    games.push(newGame);
    return newGame;
}

// Get all games
function getAllGames() {
    return games;
}

// Get a game by its ID
const getGameById = (id) => games.find(g => g.id === id);

// Update a game by its ID
const updateGameById = (id, updateData) => {
    const game = games.find(g => g.id === id);
    if (!game) return null;

    Object.assign(game, updateData);
    game.updatedAt = new Date().toISOString();
    return game;
};

// Get game by week and team (to help match picks to game data)
function getGameByWeekAndTeam(week, teamCode) {
    return games.find(
        (g) =>
            g.week === week &&
            (g.homeTeam.toUpperCase() === teamCode.toUpperCase() ||
                g.awayTeam.toUpperCase() === teamCode.toUpperCase())
    );
}

// Reset games (for testing only)
function clearGames() {
    games = [];
}

module.exports = {
    addGame,
    getAllGames,
    getGameById,
    updateGameById,
    getGameByWeekAndTeam,
    clearGames
};
