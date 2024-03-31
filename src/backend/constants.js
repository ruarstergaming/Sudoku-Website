const VALID_REG = 0
const USERNAME_TAKEN = 1;
const INVALID_PASSWORD = 2;
const INVALID_EMAIL = 3;
const DB_FAILURE = 4;

const DB_URI = "mongodb://g6:g6@localhost:24031/fpf06";

const SERVER_PORT = 24091; 

const COOKIE_OPTIONS = {
    secure: true, // so cannot use js at browser to access
    httpOnly: true, // sent over HTTPS only
    sameSite: "lax" // so can be used across whole path
};

const DISPLAY_NAME = "Fantastic Puzzles Fife (Group 6)";
const DISPLAY_URL = "https://cs3099user06.host.cs.st-andrews.ac.uk/fpf06";

module.exports = {
    VALID_REG,
    USERNAME_TAKEN,
    INVALID_PASSWORD,
    INVALID_EMAIL,
    DB_FAILURE,
    DB_URI,
    SERVER_PORT,
    COOKIE_OPTIONS,
    DISPLAY_NAME,
    DISPLAY_URL
};