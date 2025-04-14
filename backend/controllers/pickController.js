const {
    addPick,
    getAllPicks,
    getPicksByPlayer,
    updatePickStatus,
    deletePick,
    hasPickForWeek,
    hasUsedTeam
} = require('../models/pickModel');
const {
    validTeams,
    validPickTypes,
    validPickStatuses
} = require('../constants/enums');
const { getAllPlayers } = require('../models/playerModel');
const { getGameByWeekAndTeam } = require('../models/gameModel');

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
    if (hasPickForWeek(playerId, week)) {
        console.warn(`Player ${playerId} already has a pick for week ${week}`);
        return res.status(409).json({
            message: `Player ${playerId} has already submitted a pick for week ${week}.`
        });
    }

    // Prevent reuse of a team already picked by player (any week)
    if (hasUsedTeam(playerId, team)) {
        console.warn(`Player ${playerId} has already used ${team.toUpperCase()}`, { playerId, team })
        return res.status(409).json({
            message: `Player ${playerId} has already used team ${team.toUpperCase()} in a previous week.`
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

    // Prevent picking a team after game kickoff
    const game = getGameByWeekAndTeam(parseInt(week), team.toUpperCase());
    if (game) {
        const now = new Date();
        const kickoffTime = new Date(game.kickoff);

        console.log('DEBUG - NOW:', now.toISOString());
        console.log('DEBUG - KICKOFF:', kickoffTime.toISOString());

        // 1. Game has already started
        const hasStarted = now >= kickoffTime;

        // 2. Game has a final result
        const isFinal = typeof game.homeScore === 'number' && typeof game.awayScore === 'number';

        if (hasStarted || isFinal) {
            console.warn(`Invalid pick: Game already in progress or finished`, {
                team: team.toUpperCase(),
                week,
                hasStarted,
                isFinal
            });
            return res.status(400).json({
                message: `You cannot pick ${team.toUpperCase()} for Week ${week} because the game has already started or is final.`
            });
        }
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

// DELETE /api/picks/:pickId
const removePick = (req, res) => {
    const { pickId } = req.params;
    const deleted = deletePick(pickId);
    if (!deleted) {
        console.warn(`Validation failed: Pick with id ${pickId} not found`, {pickId});
        return res.status(404).json({message: 'Pick not found'});
    }
    return res.status(200).json({ message: 'Pick deleted successfully.' });
};

module.exports = {
    getPicks,
    getPicksForPlayer,
    createPick,
    updatePick,
    removePick
}