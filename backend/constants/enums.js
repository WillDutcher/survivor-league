// constants/enums.js

const validPlans = ['basic', 'premium'];

const validPickTypes = ['manual', 'auto', 'carryover'];

const validPickStatuses = ['win', 'loss', 'tie'];

const validTeams = [
    'ARI', 'ATL', 'BAL', 'BUF', 'CAR', 'CHI', 'CIN', 'CLE',
    'DAL', 'DEN', 'DET', 'GB', 'HOU', 'IND', 'JAX', 'KC',
    'LV', 'LAC', 'LAR', 'MIA', 'MIN', 'NE', 'NO', 'NYG',
    'NYJ', 'PHI', 'PIT', 'SEA', 'SF', 'TB', 'TEN', 'WAS'
];

module.exports = {
    validPlans,
    validPickTypes,
    validPickStatuses,
    validTeams
};
