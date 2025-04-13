const {
    addPick,
    getAllPicks,
    getPicksByPlayer,
    updatePickStatus
} = require('../models/pickModel');
const {
    validTeams,
    validPickTypes,
    validPickStatuses
} = require('../constants/enums');
const { getAllPlayers } = require('../models/playerModel');

// GET /api/picks
const getPicks = (req, res) => {
    const picks = getAllPicks();
    res.json(picks);
};

// Get /api/picks/:playerId
const getPicksForPlayer = (req, res) => {
    const { playerId } = req.params;
    const playerPicks = getPicksByPlayer(playerId);
    res.json(playerPicks);
};

// POST /api/picks
const createPick = (req, res) => {
    const { playerId, week, team, type } = req.body;

    // Check that required fields are present
    if (playerId === undefined || week === undefined || !team) {
        console.warn('Validation failed: createPick: playerId, week, and team are required', { playerId, week, team });
        return res.status(400).json({
            message: 'playerId, week, and team are required.'
        });
    }

    // Validate playerId is a number
    if (isNaN(playerId) || parseInt(playerId) <= 0) {
        console.warn('Validation failed: Invalid playerId', { playerId });
        return res.status(400).json({
            message: 'playerId must be a positive number.'
        });
    }

    // Check if player exists
    const playerExists = getAllPlayers().some(p => p.id === parseInt(playerId));
    if (!playerExists) {
        console.warn(`Player with ID ${playerId} does not exist`, { playerId });
        return res.status(404).json({
            message: `Player with ID ${playerId} does not exist.`
        });
    }

    // Prevent duplicate picks for same player/week
    const existingWeekPick = getPicksByPlayer(playerId).find(p => p.week === parseInt(week));
    if (existingWeekPick) {
        console.warn(`Player ${ playerId } already picked a team for week ${ week }`, { week });
        return res.status(409).json({
            message: `Player ${ playerId } has already submitted a pick for week ${ week }.`
        });
    }

    // Prevent reuse of a team already picked by player (any week)
    const alreadyPickedTeam = getPicksByPlayer(playerId).find(p => p.team === team.toUpperCase());
    if (alreadyPickedTeam) {
        console.warn(`Player ${playerId} has already picked team ${team.toUpperCase()}`, {
            playerId,
            attemptedTeam: team.toUpperCase()
        });

        return res.status(409).json({
            message: `Player ${playerId} has already picked team ${team.toUpperCase()}.`
        });
    }

    // Validate week is a number between 1 and 18
    if (isNaN(week) || parseInt(week) < 1 || parseInt(week) > 18) {
        console.warn('Validation failed: Invalid week', { week });
        return res.status(400).json({
            message: 'week must be a number between 1 and 18.'
        });
    }

    // Validate team is one of the allowed codes
    if (typeof team !== 'string' || !validTeams.includes(team.toUpperCase())) {
        console.warn('Validation failed: Invalid team name', { team });
        return res.status(400).json({
            message: 'team must be a valid 3-letter NFL team code (e.g., BUF, KC, DAL).'
        });
    }

    if (type && !validPickTypes.includes(type)) {
        console.warn('Validation failed: Invalid pick type', { type });
        return res.status(400).json({
            message: `type must be one of: ${validPickTypes.join(', ')}`
        });
    }

    // Proceed to add pick
    const newPick = addPick({
        playerId: parseInt(playerId),
        week: parseInt(week),
        team: team.toUpperCase(),
        type: type || 'manual' // optional: enforce fallback
    });

    return res.status(201).json(newPick);
};

// PATCH /api/picks/:pickId
const updatePick = (req, res) => {
    const { pickId } = req.params;
    const { status } = req.body;

    if (!status || !validPickStatuses.includes(status)) {
        console.warn('Validation failed: Invalid status', { status });
        return res.status(400).json({ message: 'Valid status (win, loss, tie) is required.' });
    }

    const updated = updatePickStatus(pickId, status);

    if (!updated) {
        console.warn('Validation failed: Invalid pickId; pickId not found', { pickId });
        return res.status(404).json({ message: `Pick with ID ${pickId} not found.` });
    }

    res.json(updated);
};

module.exports = {
    getPicks,
    getPicksForPlayer,
    createPick,
    updatePick
}