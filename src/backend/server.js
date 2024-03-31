'use strict'

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require("./schemas/User.js");
const Puzzle = require("./schemas/Puzzle.js");
const cookieParser = require('cookie-parser')
const {encryptPassword, cleanupPuzzleFiles} = require("./db_func.js");
const {DB_URI, SERVER_PORT} = require('./constants');

const app = express();
////////////////////////// CONNECTION TO DATABASE //////////////////////////

mongoose.connect(DB_URI);
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB connection established");
});

////////////////////////// RUNNING THE SERVER //////////////////////////

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(require("./routes/record"));

app.listen(SERVER_PORT);

process.on('SIGINT', function() {
    console.log("\nServer Interrupted! Beginning cleanup . . .");
    cleanupPuzzleFiles();
    console.log("Done! Exiting . . .");
    process.exit();
});

console.log("Server Started!");
console.log("Listening on port: " + SERVER_PORT);
