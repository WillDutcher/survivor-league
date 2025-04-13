// Dummy logic to simulate a player fetch
const { getAllPlayers, addPlayer } = require('../models/playerModel');
const { validPlans } = require('../constants/enums');
const {
    emailRegex,
    toProperCase,
    formatPhoneNumber
} = require('../utils/validation');

const getPlayers = (req, res) => {
    const players = getAllPlayers();
    res.json(players);
};

const createPlayer = (req, res) => {
    const { firstName, lastName, email, plan, phone, paypalEmail } = req.body;

    // Validate and normalize first name
    if (!firstName || typeof firstName !== 'string' || firstName.trim().length === 0) {
        console.warn('Validation failed: Invalid firstName', { firstName });
        return res.status(400).json({ message: 'First name is required.' });
    }

    // Validate and normalize last name
    if (!lastName || typeof lastName !== 'string' || lastName.trim().length === 0) {
        console.warn('Validation failed: Invalid lastName', { lastName });
        return res.status(400).json({ message: 'Last name is required.' });
    }

    const normalizedEmail = email?.toLowerCase();
    if (!normalizedEmail || !emailRegex.test(normalizedEmail)) {
        console.warn('Validation failed: Invalid email', { normalizedEmail });
        return res.status(400).json({ message: 'Valid email is required.' });
    }

    // Check for duplicate emails
    const existing = getAllPlayers().find((p) => p.email === normalizedEmail);
    if (existing) {
        console.warn('Validation failed: Email must be unique. Someone is already using this email address.', { normalizedEmail });
        return res.status(409).json({ message: 'A player with this email already exists.' });
    }

    // Validate plan
    if (!validPlans.includes(plan)) {
        console.warn(`Validation failed: Invalid plan type: must be one of ${validPlans.join(', ')}`, { plan });
        return res.status(400).json({
            message: `Plan must be one of: ${validPlans.join(', ')}`
        });
    }

    let formattedPhone = null;
    if (phone) {
        formattedPhone = formatPhoneNumber(phone);
        if (!formattedPhone) {
            return res.status(400).json({
                message: 'Phone number must be a 10-digit string or match format (###) ###-####.'
            });
        }
    }


    // Build player
    const newPlayer = addPlayer({
        firstName: toProperCase(firstName),
        lastName: toProperCase(lastName),
        email: normalizedEmail,
        plan,
        phone: formattedPhone,
        paypalEmail: paypalEmail?.toLowerCase() || null
    });

    return res.status(201).json(newPlayer);
};

// module.exports = { getPlayers, abc }
module.exports = {
    getPlayers,
    createPlayer
}