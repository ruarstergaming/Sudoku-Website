const User = require('./schemas/User');
const Puzzle = require('./schemas/Puzzle');
const db_consts = require('./constants');
const Comment = require('./schemas/Comment');

const { createHash } = require('crypto');
const DailyPuzzle = require('./schemas/DailyPuzzle');
const { genGame, solveSudoku } = require('./solvers');

// generic function for adding puzzle into the database -kwt2

async function addPuzzle(puzzle, solution, type, difficulty, author) {

    const id_n = genRandId();

    if (author == undefined)
        author = null;

    const puzzleToAdd = await Puzzle.create({
        id: "p" + id_n,
        variant: type,
        name: "Puzzle " + id_n + " (" + type.toUpperCase() + ")",
        data: { "puzzle": puzzle, "solution": solution },
        author: author,
        difficulty: difficulty,
        sumRatings: 0,
        numRatings: 0,
        createDate: Date.now(),
    });
}
// registration endpoint calls this function to validate and create user -kwt2
async function newUser(username, email, password, role) {

    const userArr = await User.find({ username: username });
    const user = userArr[0];

    const emailArr = await User.find({ email: email });
    const emailAdd = emailArr[0];

    // checks if username exists in the database
    if (user != undefined) {
        console.log("Username `" + username + "` already taken.");
        return db_consts.USERNAME_TAKEN;
    }

    if (emailAdd != undefined) {
        console.log("Email `" + email + "` already used.");
        return db_consts.EMAIL_USED;
    }

    if (!validatePassword(password)) {
        console.log("Invalid password, please make sure it contains at least one lowercase, uppercase, numeric and special character.");
        return db_consts.INVALID_PASSWORD;
    }

    if (!validateEmail(email)) {
        console.log("Invalid email address.");
        return db_consts.INVALID_EMAIL;
    }
    if (role == undefined) role = "guest";
    await addUser(username, email, password, role);
    console.log("User created successfully!");
    return db_consts.VALID_REG;
}

// called in newUser() to gen user, should not be called on its own -kwt2
async function addUser(username, email, password, role) {

    const id_gen = "u" + genRandId();

    const origin = {
        name: db_consts.DISPLAY_NAME,
        url: db_consts.DISPLAY_URL,
        id: id_gen
    };

    const user = await User.create({
        id: id_gen,
        email: email,
        passwordHash: encryptPassword(password),
        username: username,
        origin: origin,
        role: role,
        registerDate: Date.now(),
        puzzlesSolved: [],
        puzzlesRated: [],
        puzzlesCreated: []
    });
}

async function getAllPuzzles() {

    // passing empty filter to find all documents -kwt2
    return await Puzzle.find({});
}
async function getPuzzleById(puzzleId) {

    // query with id field -kwt2
    const result = await Puzzle.findOne({ "id": puzzleId }, "-_id -__v");
    return result;
}

async function getUserByUsername(username) {
    return await User.findOne({ username: username });
}

async function addPuzzleRating(puzzleID, newRating, username) {

    // Find the puzzle by its ID
    const puzzle = await Puzzle.findOne({ puzzleID: puzzleID });
    if (!puzzle) {
        console.log(`Puzzle with ID ${puzzleID} not found.`);
        return false;
    }
    let user = await getUserByUsername(username);
    if (user == null) {
        console.log("User is part of supergroup - will still be able to rate");
    } else if (user.puzzlesRated.indexOf(puzzleID) >= 0) { // if id in rated puzzles arr
        console.log("Puzzle already rated! Notifying user");
        return false;
    };
    // update the sumRating and numRating fields
    puzzle.sumRatings += newRating;
    puzzle.numRatings += 1;

    // save the updated puzzle
    await puzzle.save();
    return true;
}

async function getNumRating(puzzleID) {

    const puzzle = await Puzzle.findOne({ puzzleID: puzzleID }, 'numRatings');
    return puzzle.numRatings;
}

async function deleteComment(id) {
    await Comment.deleteOne({id: id});
}

async function getOverallRating(puzzleID) {

    const puzzle = await Puzzle.findOne({ puzzleID: puzzleID }, 'sumRatings numRatings');

    if (puzzle.numRatings === 0)
        return 0;
    return puzzle.sumRatings / puzzle.numRatings;
}

async function addComment(puzzleID, author, comment) {

    const id_n = genRandId();

    await Comment.create({
        id: "c" + id_n,
        puzzle_id: puzzleID,
        author: author,
        body_text: comment,
        post_date: Date.now()
    });
}

async function getComments(puzzleId, token) {

    let user = await getUserByToken(token);
    if (!user) user = {}
    let commentsArr = await Comment.find({ puzzle_id: puzzleId });
    let comments = JSON.parse(JSON.stringify(commentsArr));
    comments.forEach(comment => {
        comment['owned'] = false;
        if (comment.author == user.username || user.role == "admin") { // used at frontend to render delete buttons accordingly
            comment['owned']= true;
        }
    });
    return comments;
}

async function getUserByToken(token) {
    return await User.findOne({ 'access_token': token });
}

async function checkCredentials(username, password) {
    const userArr = await User.find({ username: username });
    const user = userArr[0];
    if (user == undefined) {
        return false;
    }

    return encryptPassword(password) == user['passwordHash'];
}

async function addRatedPuzzle(username, puzzleID) {
    let user = await getUserByUsername(username);
    if (user == null) return;
    let new_rated_arr = user.puzzlesRated; // copy old array into new 
    new_rated_arr.push(puzzleID);
    await User.updateOne({ username: username }, {
        puzzlesRated: new_rated_arr
    });
}

async function addSolvedPuzzle(username, puzzleID) {
    if (isPuzzleSolved(username, puzzleID)) return; // if already has been solved no need to add it
    let user = await getUserByUsername(username);
    let new_solved_arr = user.puzzlesSolved; 
    new_solved_arr.push(puzzleID);
    await User.updateOne({ username: username }, {
        puzzlesSolve: new_solved_arr
    });
}

async function isPuzzleSolved(username, puzzleID) {
    let user = await getUserByUsername(username);
    if (!user) return false; // if user doesnt exist on db (i.e from supergroup)
    return (user.puzzlesSolved.indexOf(puzzleID) >= 0); // return puzzleID in puzzlesSolved
}


async function getTokenByUsername(username) {
    userArr = await User.findOne({ "username": username });
    if (userArr == null) return null;
    token = userArr['access_token'];
    if (token === undefined) {
        console.log("Token for user", username, "undefined, generating new token");
        await addAccessToken(username);
        userArr = await User.findOne({ "username": username });
        token = userArr['access_token'];
    } else {
        console.log("User", username, "has existing token");
    }
    return token;
}

async function addAccessToken(username) {
    let token = Math.random().toString(36).substring(2, 22);
    resp = await User.updateOne({'username': username}, {'access_token': token});
}

async function getPuzzleByContents(data) {
    return await Puzzle.findOne({ "data.puzzle": data });
}

async function getPuzzlesByCriteria(criteria_obj) {
    return await Puzzle.find(criteria_obj);
}

// encrypt password with SHA256, returns cyphertext -kwt2
function encryptPassword(password) {

    return createHash('sha256').update(password).digest('hex');
}

// regex checking password contains at least one of the following: lower, upper case, number, special char, len 8-99 -kwt2
// reference and modified from: https://stackoverflow.com/questions/19605150/regex-for-password-must-contain-at-least-eight-characters-at-least-one-number-a
function validatePassword(password) {
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,99}$/;
    return password.match(regex);
}

// regex checking email contains an '@', 2 chars before and after that, follows by an(or series of) '.' and characters -kwt2
// reference and modified from: https://stackoverflow.com/questions/201323/how-can-i-validate-an-email-address-using-a-regular-expression
function validateEmail(email) {
    const regex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    return email.match(regex);
}

// append the code to the redirect url to send across to login site -kwt2
async function genAuthCode(redirect_url, code) {

    let redirectLink = decodeURIComponent(redirect_url);
    redirectLink = redirectLink + "?code=" + code
    return redirectLink;
}

// generate random int for user and puzzle ids -kwt2
function genRandId() {
    return Math.floor(Math.random() * (999999 - 100000 + 1) + 100000)
}

// intended to generate random access code, for testing
// and developing purposes
function genRandCode(u_id) {
    let code = '';
    code += Math.random().toString(36).substring(2, 10);
    code += u_id;
    return code;
}

function getEndOfDay() {
    return (new Date(new Date().setHours(23, 59, 59, 999)));
    
}

async function createDailyPuzzle() {

    const currentPuzzlesN = await DailyPuzzle.countDocuments({});

    const expiry = getEndOfDay();

    const puzzle = genGame();
    const solution = solveSudoku(JSON.parse(JSON.stringify(puzzle)));

    const challenge = {
        id: "d" + genRandId(),
        name: "Daily Puzzle #" + (currentPuzzlesN + 1),
        variant: "sudoku",
        data: {puzzle: puzzle, solution: solution},
        expiry: getEndOfDay()
    }

    await DailyPuzzle.create(challenge);

    return challenge;
}

async function getTodaysPuzzle() {
    let puzzle = await DailyPuzzle.findOne({"expiry": {$gt: new Date()}});
    return puzzle;
}

module.exports = {
    addPuzzle,
    newUser,
    getAllPuzzles,
    getPuzzleById,
    getUserByUsername,
    addPuzzleRating,
    getNumRating,
    getOverallRating,
    addComment,
    getComments,
    getUserByToken,
    checkCredentials,
    addRatedPuzzle,
    addSolvedPuzzle,
    isPuzzleSolved,
    getTokenByUsername,
    addAccessToken,
    getPuzzleByContents,
    getPuzzlesByCriteria,
    encryptPassword,
    validatePassword,
    validateEmail,
    genRandId,
    genAuthCode,
    genRandCode,
    deleteComment,
    createDailyPuzzle,
    getTodaysPuzzle
}