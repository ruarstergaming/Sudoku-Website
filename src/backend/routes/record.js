const express = require("express");
const { constructResponse, redirectLinkTo, checkSolution, checkValidPuzzle, mapDiffStrInt, assertSignedIn, assertCanDeleteComment, isValidGroup, getDomainByClientId } = require("../db_func");

const { getAllPuzzles, addComment, getPuzzleById, newUser, checkCredentials, genAuthCode, addPuzzle, addPuzzleRating, genRandCode, getTokenByUsername, getUserByToken, getPuzzleByContents, getComments, getPuzzlesByCriteria, addAccessToken, addRatedPuzzle, addSolvedPuzzle, isPuzzleSolved, deleteComment, createDailyPuzzle, getTodaysPuzzle} = require("../db_operations");

const { validate_puzzle } = require("../validation");

const fetch = require("node-fetch");

const fs = require('fs');
const { COOKIE_OPTIONS } = require("../constants");

const router = express.Router(); // used to define routes

router.route("/puzzle-list").get(async function(req, res) {
    let authorized = await assertSignedIn(req.cookies);
    if (!authorized) {res.status(401).send('Sorry, you are not authorized to do that.'); return;}
    let puzzles = await getAllPuzzles();
    console.log("Sending puzzle list");
    res.json(puzzles);
});

router.route("/get-puzzle").get(async function(req, res) {
    let authorized = await assertSignedIn(req.cookies);
    if (!authorized) {res.status(401).send('Sorry, you are not authorized to do that.'); return;}
    let puzzleData = await getPuzzleById(req.query['id']);
    if (req.query['id'] == undefined) {
        console.log("No id for puzzle to get specified");
    } else if (puzzleData == null) {
        console.log("Puzzle with id " + req.query['id'] + " not found");
    } else {
        console.log("Sending puzzle with id " + req.query['id']);
        let solvedBefore =  await isPuzzleSolved(req.cookies.username, req.query['id']);
        res.json({"puzzle": puzzleData['data']['puzzle'], "solution": puzzleData['data']['solution'], "name": puzzleData['name'], "variant": puzzleData['variant'], "solved": solvedBefore});
    }
});

router.route("/add-user").post(async function(req, res) {
    let role;
    req.body.admin ? role = "admin" : role = "guest"; // if admin set role
    if (role == "admin") console.log("Creating new admin");
    let validity = await newUser(
        req.body.username,
        req.body.email,
        req.body.password,
        role
    );
    console.log("Got POST add user - validity code " + validity);
    let response = constructResponse(validity);
    if (response['valid']) { // if valid login set user cookies and create access token for user
        res.cookie("username", req.body.username, COOKIE_OPTIONS);
        await addAccessToken(req.body.username);
        let token = await getTokenByUsername(req.body.username);
        res.cookie("token", token, COOKIE_OPTIONS);
    }
    res.json(response);
});

router.route("/add-puzzle").post(async function(req, res) {
    let authorized = await assertSignedIn(req.cookies);
    if (!authorized) {res.status(401).send('Sorry, you are not authorized to do that.'); return;}
    let validity = await checkValidPuzzle(JSON.parse(JSON.stringify(req.body.puzzle)), req.body.variant);
    if (validity !== null) {
        await addPuzzle(req.body.puzzle, validity, req.body.variant, mapDiffStrInt(req.body.difficulty), req.cookies.username); 
    }
    console.log("Got POST create puzzle - valid (and added) " + validity);
    res.json({ "added": validity });
});

router.route("/login-user").post(async function(req, res) {
    let loggedIn = await checkCredentials(
        req.body.username,
        req.body.password
    );
    console.log("Got POST log in - valid attempt " + loggedIn);
    let codeArr = {};
    let urlWithCode;
    if (loggedIn) {
        codeArr = { 'code': genRandCode(req.body.username) }
        urlWithCode = await genAuthCode(req.url, codeArr['code']);
    }
    res.json({ "loggedIn": loggedIn, "code": codeArr['code'], "urlWithCode": urlWithCode });
});

router.route("/rate-puzzle").post(async function(req, res) {
    let authorized = await assertSignedIn(req.cookies);
    if (!authorized) {res.status(401).send('Sorry, you are not authorized to do that.'); return;}
    console.log("Got request to rate puzzle " + req.body.id + ", " + req.body.rating + " stars");
    let success = await addPuzzleRating(req.body.id, req.body.rating, req.cookies.username);
    console.log("Rated: " + success);
    if (success) {
        await addRatedPuzzle(req.cookies.username, req.body.id);
    }
    res.json({ "rated": success });
})

router.route("/query-solution").post(async function(req, res) {
    let authorized = await assertSignedIn(req.cookies);
    if (!authorized) {res.status(401).send('Sorry, you are not authorized to do that.'); return;}
    let valid = await checkSolution(req.body['id'], req.body['data'], req.body['isDaily']);
    console.log("Received solution check request - result " + valid);
    if (valid) {
        await addSolvedPuzzle(req.cookies.username, req.body['id']); // pass username so if solved correctly this is stored
    }
    res.json({ "valid": valid });
});

// a request to be redirected from the user browser to the group specified (for sign in)
router.route("/sign-in-foreign").get(async function(req, res) { // as client, request from user browser
    console.log("Foreign sign-in request");
    items = await redirectLinkTo(req.query.gNumber);
    req_url = items.redirect_url.replace("/oauth/redirect/g6", "/oauth/authorize") + "/" + items.client_id;
    if (req.query.gNumber == 5) { // group 5 is edge case where server is hosted on /backend/...
        req_url = items.redirect_url.replace("/backend/oauth/redirect/g6", "/oauth/authorize") + "/" + items.client_id;
    } else {
        req_url = items.redirect_url.replace("/oauth/redirect/g6", "/oauth/authorize") + "/" + items.client_id;
    }
    console.log("Redirecting after /sign-in-foreign, URL", req_url)
    res.redirect(req_url);
});



router.route("/oauth/authorize").get(async function(req, res) { // as endpoint, request from client
    console.log("Received /oauth/authorize GET");
    res.redirect("/fpf06/redirect-landing?redirect_url=" + encodeURIComponent(req.query.redirect_url) + "&client_id=" + encodeURIComponent(req.query.client_id));
    // redirect to frontend
});

router.route("/oauth/redirect/*").get(async function(req, res) { // as client, request from endpoint
    console.log("Received GET /oauth/redirect/*");
    items = await redirectLinkTo(req.url.split("/").at(-1).split("?").at(0), true); // get query params
    req_url = new URL(items.redirect_url).origin + "/oauth/token";
    console.log(items.client_id);
    if (items.client_id == "aces5") { // group 5 edge case
        req_url = req_url.replace("/oauth/token", "/backend/oauth/token")
    } else if (items.client_id == "aces-g7") {
        req_url = req_url.replace("/oauth/token", "/api/oauth/token");
    } else if (items.client_id == "cs3099group03") {
        req_url = req_url.replace("/oauth/token", "/api/foreignUserCode");
    }
    let own_domain = await getDomainByClientId("g6");
    let token_res = await fetch(req_url, {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            "access_code": req.query.code,
            "client_id": own_domain.client_id, 
            "client_secret": own_domain.client_secret
        }) // send our unique data as way of authenticating endpoint
    });
    if (token_res.ok) {
        token_json = await token_res.json();
    } else {
        res.status(401).send('Sorry, you are not authorized to do that.'); return;
    }
    if (items.client_id == "aces-g7") {
        req_url = req_url.replace("/api/oauth/token", "/api/user/me");
    } else {
        req_url = req_url.replace("/oauth/token", "/api/user/me");
    }
    let user_response = await fetch(req_url, {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            "access_token": token_json['access_token']
        })
    });
    user_response = await user_response.json();
    res.cookie("token", token_json.access_token, COOKIE_OPTIONS);
    console.log(token_json.access_token);
    res.cookie("username", user_response.username, COOKIE_OPTIONS);
    res.cookie("origin", items.client_id, COOKIE_OPTIONS);
    res.redirect("/fpf06");
});

router.route("/oauth/token").post(async function(req, res) { // as endpoint, request from client (requesting access token)
    console.log("Got POST access_code");
    let authorized = (await isValidGroup(req.body.client_id, req.body.client_secret)) || (req.body.client_id == "g6")
    if (!authorized || !req.body.access_code) {res.status(401).send('Sorry, you are not authorized to do that.'); return;}
    username = req.body.access_code.slice(8, req.body.access_code.length);
    token = await getTokenByUsername(username);
    res.json({ "access_token": token });
});

router.route("/api/user/me").post(async function(req, res) { // as endpoint, request from client (requesting user data)
    console.log("Got request for user data");
    userArr = await getUserByToken(req.body.access_token);
    if (req.body.local) {
        res.cookie("token", req.body.access_token, COOKIE_OPTIONS);
        res.cookie("username", userArr.username, COOKIE_OPTIONS);
    }
    res.json(userArr);
});

router.route("/download-puzzle").get(async function(req, res) {
    let authorized = await assertSignedIn(req.cookies);
    if (!authorized) {res.status(401).send('Sorry, you are not authorized to do that.'); return;}
    console.log("Requested download of puzzle", req.query['id']);
    let puzzle = await getPuzzleById(req.query['id']);
    let filename = puzzle['variant'].toUpperCase() + req.query['id'] + ".json"; // example: SUDOKUp999.json
    if (!fs.existsSync(__dirname + "/puzzle_files")) {
        fs.mkdirSync(__dirname + "/puzzle_files");
    }
    if (!fs.existsSync(__dirname + "/puzzle_files/" + filename)) {
        fs.appendFileSync(__dirname + "/puzzle_files/" + filename, JSON.stringify(puzzle, null, 2));
    }
    res.download(__dirname + "/puzzle_files/" + filename, async function(err) {
        if (err) console.log("DOWNLOAD ERROR : " + err);
    });
});

router.route("/upload-puzzle").post(async function(req, res) {
    let authorized = await assertSignedIn(req.cookies);
    if (!authorized) {res.status(401).send('Sorry, you are not authorized to do that.'); return;}
    console.log("Received upload request");
    let puzzleObj = req.body;
    let response = {"added": true, "reason": ""} // assume valid change if not
    if (!validate_puzzle(puzzleObj)) {
        response.added = false;
        response.reason = "Invalid JSON format.";
    } else {
        let solution = solveSudoku(JSON.parse(JSON.stringify(puzzleObj.data.puzzle)));
        if (!solution) {
            response.added = false;
            response.reason = "Puzzle supplied is not valid (cannot be solved)!";
        } else {
            if (await getPuzzleByContents(puzzleObj.data.puzzle)) {
                response.added = false;
                response.reason = "Puzzle already exists!";
            } else {
                await addPuzzle(puzzleObj.data.puzzle, solution, puzzleObj.variant, puzzleObj.difficulty)
            }
        }
    }
    console.log("Puzzle uploaded -", response.added);
    res.json(response);
});

router.route("/post-comment").post(async function(req, res) {
    let authorized = await assertSignedIn(req.cookies);
    if (!authorized) {res.status(401).send('Sorry, you are not authorized to do that.'); return;}
    console.log("Received comment POST");
    let cObj = req.body
    await addComment(cObj.puzzle_id, req.cookies.username, cObj.body_text);
    res.json({"added": true});
});

router.route("/get-comments").get(async function(req, res) {
    let authorized = await assertSignedIn(req.cookies);
    if (!authorized) {res.status(401).send('Sorry, you are not authorized to do that.'); return;}
    console.log("Sending comments for puzzle", req.query['id'])
    res.json(await getComments(req.query['id'], req.cookies.token));
});

router.route("/get-matching-puzzles").get(async function(req, res) {
    let authorized = await assertSignedIn(req.cookies);
    if (!authorized) {res.status(401).send('Sorry, you are not authorized to do that.'); return;}
    let v = req.query['v'];
    let d = req.query['d'];
    let r = req.query['r'];
    console.log("Sending matching puzzles (v", v + ", d", d + ", min r", r + ")");
    let criteria = {variant: v, difficulty: d};
    let puzzles = await getPuzzlesByCriteria(criteria); // still need to filter by rating
    let matched_puzzles = [];
    for (puzzle of puzzles) { // remove by min rating
        if (!puzzle.numRatings == 0) {
            if (puzzle.sumRatings / puzzle.numRatings > r && !(await isPuzzleSolved(req.cookies.username, puzzle.id))) {
                matched_puzzles.push(puzzle);
            } 
        } else if (!(await isPuzzleSolved(req.cookies.username, puzzle.id))) {
            matched_puzzles.push(puzzle);
        }
    }
    if (matched_puzzles.length == 0) {
        res.json({}); 
    } else {
        let random_puzzle = matched_puzzles[Math.floor(Math.random() * matched_puzzles.length)]; // random puzzle in array
        res.json(random_puzzle);
    }

});

router.route("/sign-out").get(async function(req, res) { // request sent by user on the login page
    console.log("Received signout request");
    res.clearCookie("token");
    res.clearCookie("username");
    res.clearCookie("origin");
    res.send();
});

router.route("/check-logged-in").get(async function(req, res) {
    console.log("Received sign in check");
    if (req.cookies.origin !== undefined) { // if from supergroup
       let queryURL = await getDomainByClientId(req.cookies.origin);
       if (!queryURL) { console.log("Could not find domain by id", req.cookies.origin); res.json({loggedIn: false}); return; } // if not from valid group
       queryURL = queryURL.redirect_url.replace("/oauth/redirect", "/api/user/me");
       let user_response = await fetch(queryURL, {
            method: "POST",
            mode: "cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({"access_token": req.cookies.token})
        });
        if (!user_response) {
            console.log("Not signed in - invalid supergroup credentials"); res.json({loggedIn: authorized});
        } else {
            console.log("Valid account through supergroup");
            res.json({loggedIn: true});
            return;
        }

    }
    if (req.cookies.token == undefined || req.cookies.token == "") {
        console.log("Not signed in - invalid token")
        res.json({loggedIn: false});
    } else if (req.cookies.username == undefined || req.cookies.username == "") {
        console.log("Not signed in - invalid username")
        res.json({loggedIn: false});
    } else {
        let authorized = await assertSignedIn(req.cookies);
        console.log("Token-username combination authorized -", authorized);
        res.json({loggedIn: authorized});
    }
})

router.route("/api/puzzles").get(async function(req, res) {
    console.log("Received puzzle list request from supergroup, max puzzles", req.query['maxPuzzles']);
    let puzzles = await getAllPuzzles();
    if (isNaN(parseInt(req.query['maxPuzzles']))) { // if not valid max puzzles send all
        res.json(puzzles);
    } else if (parseInt(req.query['maxPuzzles']) > puzzles.length) { // if max puzzles is greater than number of puzzles
        res.json(puzzles);
    } else {
        res.json(puzzles.slice(0, req.query['maxPuzzles']));
    }
});

router.route("/get-profile-info").get(async function(req, res) {
    console.log("Received profile info request");
    let authorized = await assertSignedIn(req.cookies);
    if (!authorized) {res.status(401).send('Sorry, you are not authorized to do that.'); return;}
    let userArr;
    if (req.cookies.origin != undefined) { // if foreign user
        let domainURL = await getDomainByClientId(req.cookies.origin);
        if (!domainURL) {res.status(401).send('Sorry, you are not authorized to do that.'); return;}
        domainURL = domainURL.redirect_url.replace("/oauth/redirect", "/api/user/me");
        userArr = await fetch(domainURL, {
            method: "POST",
            mode: "cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({"access_token": req.cookies.token})
        });
        userArr = await userArr.json();
    } else {
        userArr = await getUserByToken(req.cookies.token);
    }
    if (!userArr) {res.status(401).send('Sorry, you are not authorized to do that.'); return;}
    profileInfo = {
        origin: userArr.origin,
        email: userArr.email,
        username: userArr.username,
        role: userArr.role,
        registerDate: userArr.registerDate,
        puzzlesSolved: userArr.puzzlesSolved,
        puzzlesRated: userArr.puzzlesRated
    }; 
    res.json(profileInfo);
});

router.route("/get-daily-challenge").get(async function(req, res) {
    console.log("Received request for daily challenge");
    let authorized = await assertSignedIn(req.cookies);
    if (!authorized) {res.status(401).send('Sorry, you are not authorized to do that.'); return;}
    let current = await getTodaysPuzzle();
    if (!current) {
        current = await createDailyPuzzle();
    }
    res.json({
        puzzle: current.data.puzzle,
        solution: current.data.solution,
        name: current.name,
        variant: current.variant,
        isDaily: true
    });

});

router.route("/delete-comment").get(async function(req, res) {
    console.log("Received request to delete comment id " + req.query['id']);
    let authorized = (await assertSignedIn(req.cookies)) && (await assertCanDeleteComment(req.cookies, req.query['id']));
    if (!authorized) {res.status(401).send('Sorry, you are not authorized to do that.'); return;}
    await deleteComment(req.query['id']);
    res.json({"deleted": true});
})

router.route("*").get(async function(req, res) {
    console.log("Received erroneous request - redirecting to frontend");
    console.log("Request url:");
    console.log(req.url);
    res.redirect("/fpf06");
});

module.exports = router;