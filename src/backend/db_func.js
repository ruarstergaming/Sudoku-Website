const Domain = require('./schemas/Domain');
const fs = require('fs');
const db_consts = require('./constants');
const { getPuzzleById, getPuzzleByContents, getTokenByUsername, getUserByToken, getTodaysPuzzle } = require("./db_operations");
const { solveSudoku, solveKnightSudoku } = require("./solvers");
const Comment = require('./schemas/Comment');
const prompt = require('prompt-sync')({ sigint: true });

const localClientId = "g6";
const localRedirectUrl = "https://cs3099user06.host.cs.st-andrews.ac.uk/oauth/redirect";


async function redirectLinkTo(groupNum, by_id) {

    if (by_id) {
        domainArr = await Domain.find({ client_id: groupNum });
    } else { // else by group number
        domainArr = await Domain.find({ groupNum: groupNum });
    }
    domain = domainArr[0];

    if (domain == undefined) {
        console.log("Group " + groupNum + " is not a registered domain.");
        return {
            "client_id": undefined,
            "redirect_url": undefined
        };
    }
    let redirectLink = domain.redirect_url;
    redirectLink = redirectLink + "/" + localClientId + "?client_id=" + localClientId;
    redirectLink = redirectLink + "&redirect_url=" + encodeURIComponent(localRedirectUrl);
    return {
        "client_id": domain.client_id,
        "redirect_url": redirectLink
    };
}

function constructResponse(validityCode) {
    let response = {};
    if (validityCode != db_consts.VALID_REG) {
        response['valid'] = false;
    } else {
        response['valid'] = true;
        return response;
    }
    if (validityCode == db_consts.USERNAME_TAKEN) {
        response['reason'] = "Username already taken!";
    } else if (validityCode == db_consts.EMAIL_USED) {
        response['reason'] = "Email address already used!";
    } else if (validityCode == db_consts.INVALID_PASSWORD) {
        response['reason'] = "Password is of invalid format!\nShould contain at least one lower, upper case, numeric and special character!";
    } else if (validityCode == db_consts.INVALID_EMAIL) {
        response['reason'] = "Email address is not valid!";
    } else if (validityCode == db_consts.DB_FAILURE) {
        response['reason'] = "Failed to add user (server-side issue)";
    }
    response['code'] = Math.random().toString(16).substring(2, 8); // random string
    return response;
}

// referenced and edited from https://stackoverflow.com/questions/42736648/sudoku-solver-in-js
async function checkSolution(id, puzzle, isDaily) {
    let puzzleObj = {};
    if (isDaily) {
        puzzleObj = await getTodaysPuzzle();
    } else {
        puzzleObj = await getPuzzleById(id);
    }
    return (JSON.stringify(puzzle) == JSON.stringify(puzzleObj['data']['solution']));
}

async function checkValidPuzzle(board, variant) {
    let solution;
    if (variant == "sudoku") {
        solution = await solveSudoku(board);
    } else if (variant == "knights-sudoku") {
        solution = await solveKnightSudoku(board);
    }
    if (solution == null) {
        return null;
    }
    if (await getPuzzleByContents(board)[0] !== undefined) { // if puzzle already exists
        return null;
    }
    return solution;
}

function warnDbChanges(collectionName) {
    console.log("The action you are about to perform will clear all records associated with the collection " + collectionName)
    let response = ""
    while (response.toLowerCase() != "y" && response.toLowerCase() != "n") {
        response = prompt("Are you sure you wish to proceed (y/n)? ");
    }
    return response.toLowerCase() == "y";
}

function mapDiffStrInt(diffStr) { // mapping required to comply with the supergroup spec
    if (diffStr === "easy") return 1;
    if (diffStr === "medium") return 5;
    if (diffStr === "hard") return 10;
    return 5;
}

/*
 * Given a cookies object, parse the cookies and determine whether or not the client is signed in.
 * The function checks that both token and username are defined, and that this pair is valid.
 */
async function assertSignedIn(cookies) {
    if (cookies == undefined) return false;
    let username = cookies.username;
    let token = cookies.token;
    let origin = cookies.origin;
    if (origin !== undefined) return true;
    if (username == undefined) return false;
    if (token == undefined) return false;
    let gathered_token = await getTokenByUsername(username);
    let gathered_username = await getUserByToken(token);
    if (gathered_token == null) return false;
    if (gathered_username == null) return false;
    gathered_username = gathered_username['username'];
    if (gathered_token != token) return false;
    if (gathered_username != username) return false;
    return true;
}

async function assertCanDeleteComment(cookies, comment_id) { // assume validated with assertSignedIn
    let user = await getUserByToken(cookies.token);
    if (user.role == "admin") return true; // admins can delete the comment regardless of who posted it
    let comment = await Comment.findOne({"id": comment_id});
    if (comment == null) return false; // if comment doesn't exist can't delete it!
    return (comment.author == cookies.username); // then last check is if user posted comment
}

function cleanupPuzzleFiles() { // called on server closedown - removes stored puzzle download files!
    try {
        let filenames = fs.readdirSync(__dirname + "/routes/puzzle_files/");
        for (filename of filenames) {
            fs.rmSync(__dirname + "/routes/puzzle_files/" + filename);
        }
        fs.rmdirSync(__dirname + "/routes/puzzle_files");
    } catch (err) {} // do nothing on error
}

async function isValidGroup(provided_id, provided_secret) {
    let group = await Domain.findOne({client_id: provided_id, client_secret: provided_secret});
    return (group != null); // return if a group exists with the id secret pair provided
}

async function getDomainByClientId(client_id) {
    return await Domain.findOne({client_id: client_id});
}

module.exports = {
    constructResponse,
    redirectLinkTo,
    checkSolution,
    checkValidPuzzle,
    warnDbChanges,
    mapDiffStrInt,
    assertSignedIn,
    assertCanDeleteComment,
    cleanupPuzzleFiles,
    isValidGroup,
    getDomainByClientId
};