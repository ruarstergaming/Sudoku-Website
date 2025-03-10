const {solveSudoku} = require("../backend/db_func")

const puzzleOne = [[0,0,0,0,0,0,0,5,0],
[7,0,7,0,0,9,0,0,0],
[6,0,0,3,5,1,0,0,0],
[5,0,0,0,0,0,0,1,0],
[0,0,3,0,0,0,0,0,8],
[0,0,0,8,2,0,5,3,0],
[0,0,0,0,7,0,8,0,4],
[0,0,6,2,0,0,0,0,0],
[0,8,0,0,0,0,7,0,0]]

const puzzleTwo = [[0,0,1,3,0,0,0,0,6],
[7,0,3,0,0,6,0,0,1],
[0,0,0,8,0,0,0,4,0],
[0,0,0,0,6,0,5,3,0],
[3,7,4,0,9,0,1,0,2],
[8,6,5,0,0,0,0,0,0],
[0,0,0,4,2,0,9,1,0],
[0,0,0,0,8,0,2,0,0],
[0,3,0,9,0,0,0,0,0]]

const puzzleThree = [[5,5,5,5,5,5,5,5,5],
[5,5,5,5,5,5,5,5,5],
[5,5,5,5,5,5,5,5,5],
[5,5,5,5,5,5,5,5,5],
[0,0,0,0,0,0,0,0,0],
[5,5,5,5,5,5,5,5,5],
[0,0,0,0,0,0,0,0,0],
[5,5,5,5,5,5,5,5,5],
[0,0,0,0,0,0,0,0,0]]

console.log(solveSudoku(puzzleOne))
console.log(solveSudoku(puzzleTwo))
console.log(solveSudoku(puzzleThree))
