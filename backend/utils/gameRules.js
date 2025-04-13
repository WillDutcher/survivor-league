function getPlayerStats(picks, plan) {
    const statusCounts = {
        win: 0,
        loss: 0,
        tie: 0,
        pending: 0
    };

    picks.forEach(pick => {
        if (statusCounts[pick.status] !== undefined) {
            statusCounts[pick.status]++;
        }
    });

    const rebuysUsed = statusCounts.loss;

    // BASIC: No rebuys after Week 5
    const canRebuyBasic = rebuysUsed === 0 || rebuysUsed === 1;

    // PREMIUM: 3 free rebuys through Week 8
    const canRebuyPremium = rebuysUsed < 3;

    const isEliminated = (
        (plan === 'basic' && rebuysUsed > 1) ||
        (plan === 'premium' && rebuysUsed >= 3)
    );

    return {
        wins: statusCounts.win,
        losses: statusCounts.loss,
        ties: statusCounts.tie,
        pending: statusCounts.pending,
        rebuysUsed,
        isEliminated,
        canRebuy: plan === 'premium' ? canRebuyPremium : canRebuyBasic
    };
}


module.exports = {
    getPlayerStats
};
