// backend/utils/validation.js

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;

const toProperCase = (str) =>
    str
        .toLowerCase()
        .split(' ')
        .map(word => word.length <= 2 ? word.toUpperCase() : word[0].toUpperCase() + word.slice(1))
        .join(' ');

const formatPhoneNumber = (input) => {
    if (phoneRegex.test(input)) return input;
    if (/^\d{10}$/.test(input)) {
        return `(${input.slice(0, 3)}) ${input.slice(3, 6)}-${input.slice(6)}`;
    }
    return null;
};

module.exports = {
    emailRegex,
    phoneRegex,
    toProperCase,
    formatPhoneNumber
};
