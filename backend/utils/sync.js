const { getAllPicks } = require('../models/pickModel');
const { getGameByWeekAndTeam } = require('../models/gameModel');
const { updatePickResult } = require('./pickLogic');

function syncPickResults() {
    const picks = getAllPicks();
    const updated = [];

    for (const pick of picks) {
        if (pick.status !== 'pending') continue;

        const game = getGameByWeekAndTeam(pick.week, pick.team);
        if (!game || !game.winner) continue; // Skip if game is unresolved or not found

        const result = updatePickResult(pick, game);
        updated.push(result);
    }

    return updated;
}

module.exports = { syncPickResults };
