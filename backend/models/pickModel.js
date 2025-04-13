let picks = [];

// Create a new pick
const addPick = ({ playerId, week, team, type = 'manual' }) => {
    const id = picks.length + 1;
    const pick = {
        id,
        playerId,
        week,
        team,
        status: 'pending', // pending, win, loss, tie
        type,              // 'manual' | 'auto' | 'carryover'
        submittedAt: new Date().toISOString()
    };
    picks.push(pick);
    return pick;
};

// Get all picks
const getAllPicks = () => picks;

// Get picks for a specific player
const getPicksByPlayer = (playerId) => {
    return picks.filter((pick) => pick.playerId === parseInt(playerId));
};

const updatePickStatus = (pickId, status) => {
    const pick = picks.find((p) => p.id === parseInt(pickId));
    if (pick) {
        pick.status = status;
        return pick;
    }
    return null;
};

const deletePick = (pickId) => {
    const index = picks.findIndex(p => p.id === parseInt(pickId));
    if (index !== -1) {
        return picks.splice(index, 1)[0]; // returns the deleted pick
    }
    return null;
};

const hasPickForWeek = (playerId, week) => {
    return picks.some(p => p.playerId === parseInt(playerId) && p.week === parseInt(week));
};

const hasUsedTeam = (playerId, team) => {
    return picks.some(
        (p) => p.playerId === parseInt(playerId) && p.team === team.toUpperCase()
    );
};

module.exports = {
    addPick,
    getAllPicks,
    getPicksByPlayer,
    updatePickStatus,
    deletePick,
    hasPickForWeek,
    hasUsedTeam
}