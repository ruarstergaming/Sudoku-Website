const { warnDbChanges } = require("../db_func");
const {addPuzzle} = require("../db_operations")
const {DB_URI} = require("../constants");
const Puzzle = require("../schemas/Puzzle");
const mongoose = require('mongoose');
const { solveKnightSudoku, solveSudoku } = require("../solvers");

async function populate_puzzles() {

    await Puzzle.deleteMany({});

    const testPuzzleArr1 = [[0,0,0,0,0,0,0,5,0],
    [2,0,7,0,0,9,0,0,0],
    [6,0,0,3,5,1,0,0,0],
    [5,0,0,0,0,0,0,1,0],
    [0,0,3,0,0,0,0,0,8],
    [0,0,0,8,2,0,5,3,0],
    [0,0,0,0,7,0,8,0,4],
    [0,0,6,2,0,0,0,0,0],
    [0,8,0,0,0,0,7,0,0]]

    await addPuzzle(testPuzzleArr1, solveSudoku(JSON.parse(JSON.stringify(testPuzzleArr1))), "sudoku", 1); // add test puzzle 1

    const testPuzzleArr2 = [[0,0,1,3,0,0,0,0,6],
    [7,0,3,0,0,6,0,0,1],
    [2,0,0,8,0,0,0,4,0],
    [0,0,0,0,6,0,5,3,0],
    [3,7,4,0,9,0,1,0,2],
    [8,6,5,0,0,0,0,0,0],
    [0,0,0,4,2,0,9,1,0],
    [0,0,0,0,8,0,2,0,0],
    [0,3,0,9,0,0,0,0,0]]

    await addPuzzle(testPuzzleArr2, solveSudoku(JSON.parse(JSON.stringify(testPuzzleArr2))), "sudoku", 5); // add test puzzle 2

    const testPuzzleArr3 = [
        [7,0,0,2,0,0,0,0,0],
        [0,0,0,0,0,0,6,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,3,0,0,0,0,0,8,0],
        [0,0,0,0,0,0,0,0,0],
        [9,5,0,0,0,0,0,4,3],
        [3,0,0,0,0,0,0,9,8],
        [0,0,1,0,0,0,2,0,0],
        [5,0,0,7,0,8,0,0,4]
    ];

    await addPuzzle(testPuzzleArr3, solveKnightSudoku(JSON.parse(JSON.stringify(testPuzzleArr3))), "knights-sudoku", 10); // add test puzzle 3 (knights)

    console.log("Done!");
    process.exit();
}

if (warnDbChanges("Puzzle")) { // if user agrees
    mongoose.connect(DB_URI);
    const connection = mongoose.connection;
    connection.once('open', () => {
        console.log("MongoDB connection established");
    });
    console.log("Commencing puzzle population");
    populate_puzzles();
}