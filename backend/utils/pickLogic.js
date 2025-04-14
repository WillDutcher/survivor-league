function updatePickResult(pick, game) {
    const { homeTeam, awayTeam, homeScore, awayScore, winner, loser, score, kickoff } = game;

    // Disallow updates for games that already started
    const now = new Date();
    const kickoffTime = new Date(kickoff);
    if (now < kickoffTime) {
        return pick; // Don't update anything if game hasn't kicked off yet
    }

    pick.result = {
        winner,
        loser,
        score
    };

    if (homeScore === awayScore) {
        pick.status = 'tie';
    } else if (pick.team === winner) {
        pick.status = 'win';
    } else {
        pick.status = 'loss';
    }

    pick.updatedAt = new Date().toISOString();
    return pick;
}
// TODO: Consider attaching gameId to pick when syncing results for easier lookup and traceability.
// TODO: Automatically trigger pick syncing after a game is updated (instead of requiring manual sync call).

module.exports = { updatePickResult };