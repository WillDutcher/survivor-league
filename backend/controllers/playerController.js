// Dummy logic to simulate a player fetch
const {
    getAllPlayers,
    addPlayer,
    getPlayerById,
    deletePlayer
} = require('../models/playerModel');
const { validPlans } = require('../constants/enums');
const {
    emailRegex,
    toProperCase,
    formatPhoneNumber,
    isValidPassword
} = require('../utils/validation');
const bcrypt = require('bcrypt');

const getPlayers = (req, res) => {
    const players = getAllPlayers();
    res.json(players);
};

const createPlayer = async (req, res) => {
    const { firstName, lastName, email, password, plan, phone, paypalEmail } = req.body;

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

    // Check for valid password
    if (!password || typeof password !== 'string' || !isValidPassword(password)) {
        console.warn('Validation failed: Invalid password format');
        return res.status(400).json({
            message:
                'Password must be at least 8 characters and include an uppercase letter, lowercase letter, number, and special character.'
        });
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

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Build player
    const newPlayer = addPlayer({
        firstName: toProperCase(firstName),
        lastName: toProperCase(lastName),
        email: normalizedEmail,
        passwordHash,
        plan,
        phone: formattedPhone,
        paypalEmail: paypalEmail?.toLowerCase() || null
    });

    return res.status(201).json(newPlayer);
};

const updatePlayer = async (req, res) => {
    const { playerId } = req.params;
    const player = getPlayerById(playerId);

    if (!player) {
        return res.status(404).json({ message: 'Player not found' });
    }

    const {
        firstName,
        lastName,
        email,
        password,
        plan,
        phone,
        paypalEmail
    } = req.body;

    if (firstName) player.firstName = toProperCase(firstName);
    if (lastName) player.lastName = toProperCase(lastName);
    if (email && emailRegex.test(email)) player.email = email.toLowerCase();
    if (plan && validPlans.includes(plan)) player.plan = plan;
    if (phone) {
        const formattedPhone = formatPhoneNumber(phone);
        if (!formattedPhone) {
            return res.status(400).json({ message: 'Invalid phone format.' });
        }
        player.phone = formattedPhone;
    }
    if (paypalEmail) player.paypalEmail = paypalEmail.toLowerCase();

    if (password) {
        if (!isValidPassword(password)) {
            return res.status(400).json({
                message: 'Password must meet strength requirements.'
            });
        }
        const saltRounds = 10;
        player.passwordHash = await bcrypt.hash(password, saltRounds);
    }

    player.updatedAt = new Date().toISOString();

    return res.status(200).json({ message: 'Player updated successfully.', player });
};

const removePlayer = (req, res) => {
    const { playerId } = req.params;
    const deleted = deletePlayer(playerId);
    if (!deleted) {
        console.warn(`Player ${playerId} not found`, { playerId });
        return res.status(404).json({ message: 'Player not found' });
    }
    return res.status(200).json({ message: 'Player deleted successfully' });
};

// module.exports = { getPlayers, abc }
module.exports = {
    getPlayers,
    createPlayer,
    updatePlayer,
    removePlayer
}