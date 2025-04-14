const {
    addGame,
    getAllGames,
    getGameById,
    updateGameById
} = require('../models/gameModel');

const validTeams = require('../constants/enums').validTeams;

// GET /api/games
const getGames = (req, res) => {
    const games = getAllGames();
    res.json(games);
};

// POST /api/games
const createGame = (req, res) => {
    const {
        week,
        homeTeam,
        awayTeam,
        homeScore,
        awayScore,
        gameSpread,
        kickoff
    } = req.body;

    // Validate week
    if (!week || isNaN(week) || week < 1 || week > 18) {
        return res.status(400).json({ message: 'Week must be a number between 1 and 18.' });
    }

    // Validate teams
    if (!validTeams.includes(homeTeam) || !validTeams.includes(awayTeam)) {
        return res.status(400).json({ message: 'Both teams must be valid 3-letter NFL codes.' });
    }
    if (homeTeam === awayTeam) {
        return res.status(400).json({ message: 'Home and away teams must be different.' });
    }

    // Validate scores
    let parsedHome = null;
    let parsedAway = null;

    if (homeScore !== undefined && awayScore !== undefined) {
        parsedHome = parseInt(homeScore);
        parsedAway = parseInt(awayScore);

        if (isNaN(parsedHome) || isNaN(parsedAway)) {
            return res.status(400).json({ message: 'Home and away scores must be numbers.' });
        }
    }

    // Validate kickoff
    if (!kickoff || isNaN(Date.parse(kickoff))) {
        return res.status(400).json({ message: 'Valid kickoff datetime required.' });
    }

    // Determine winner/loser/tie
    let winner = null;
    let loser = null;
    let score = null;

    if (parsedHome !== null && parsedAway !== null) {
        score = `${parsedHome} - ${parsedAway}`;
        if (parsedHome > parsedAway) {
            winner = homeTeam;
            loser = awayTeam;
        } else if (parsedAway > parsedHome) {
            winner = awayTeam;
            loser = homeTeam;
        }
    }

    const existingGames = getAllGames();

    // Check if either team already has a game in this week
    const conflict = existingGames.find(game =>
        game.week === week &&
        (
            game.homeTeam === homeTeam ||
            game.awayTeam === homeTeam ||
            game.homeTeam === awayTeam ||
            game.awayTeam === awayTeam
        )
    );

    if (conflict) {
        console.warn(`Game conflict in Week ${week} for team(s) ${homeTeam}/${awayTeam}`);
        return res.status(409).json({
            message: `Conflict: One of these teams already has a game scheduled in Week ${week}.`
        });
    }

    const newGame = addGame({
        week,
        homeTeam,
        awayTeam,
        homeScore: parsedHome,
        awayScore: parsedAway,
        winner,
        loser,
        score,
        gameSpread: gameSpread?.toString() || null,
        kickoff
    });

    return res.status(201).json(newGame);
};

const updateGame = (req, res) => {
    const { id } = req.params;
    const { homeScore, awayScore } = req.body;

    const game = getGameById(parseInt(id));
    if (!game) {
        return res.status(404).json({ message: 'Game not found.' });
    }

    if (homeScore === undefined || awayScore === undefined) {
        return res.status(400).json({ message: 'Both scores are required to update the game.' });
    }

    const parsedHome = parseInt(homeScore);
    const parsedAway = parseInt(awayScore);

    if (isNaN(parsedHome) || isNaN(parsedAway)) {
        return res.status(400).json({ message: 'Scores must be numeric values.' });
    }

    const winner = parsedHome > parsedAway ? game.homeTeam
        : parsedAway > parsedHome ? game.awayTeam
            : null;

    const loser = parsedHome < parsedAway ? game.homeTeam
        : parsedAway < parsedHome ? game.awayTeam
            : null;

    const updated = updateGameById(parseInt(id), {
        homeScore: parsedHome,
        awayScore: parsedAway,
        score: `${parsedHome} - ${parsedAway}`,
        winner,
        loser
    });

    return res.status(200).json(updated);
};

module.exports = {
    getGames,
    createGame,
    updateGame
};
