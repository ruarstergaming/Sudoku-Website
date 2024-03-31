// This function takes a 2D array representing the game board as an argument
// code referenced and edited from: https://www.geeksforgeeks.org/solving-sudoku-using-bitwise-algorithm
function solveSudoku(data) {
    // initialize row, col, and box arrays
    let row = new Array(9).fill(0);
    let col = new Array(9).fill(0);
    let box = new Array(9).fill(0);

    // set up the row, column, and box arrays for initial values on the board
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            let num = data[i][j];
            if (num !== 0) {
                let mask = 1 << (num - 1);
                // check if the value is already in row, column or box, and return null if it is
                if ((row[i] & mask) !== 0 || (col[j] & mask) !== 0 || (box[Math.floor(i / 3) * 3 + Math.floor(j / 3)] & mask) !== 0) {
                    return null;
                }
                // add the value to the row, column, and box arrays using a bit mask
                row[i] |= mask;
                col[j] |= mask;
                box[Math.floor(i / 3) * 3 + Math.floor(j / 3)] |= mask;
            }
        }
    }

    // loop through every cell in the board
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            // if the cell is empty (i.e. value = 0)
            if (data[i][j] === 0) {
                // loop through every possible value (1-9)
                for (let k = 1; k <= 9; k++) {
                    let mask = 1 << (k - 1);
                    // check if the value is not already in row, column, or box
                    if ((row[i] & mask) === 0 && (col[j] & mask) === 0 && (box[Math.floor(i / 3) * 3 + Math.floor(j / 3)] & mask) === 0) {
                        // if the value is valid, add it to the board and update the row, column, and box arrays
                        data[i][j] = k;
                        row[i] |= mask;
                        col[j] |= mask;
                        box[Math.floor(i / 3) * 3 + Math.floor(j / 3)] |= mask;
                        // recursively call the solveSudoku function with the updated board
                        // if the function returns a valid solution, return the board
                        if (solveSudoku(data)) {
                            return data;
                        }
                        // if the function doesn't return a valid solution, reset the cell value to 0
                        // and update the row, column, and box arrays accordingly
                        data[i][j] = 0;
                        row[i] &= ~mask;
                        col[j] &= ~mask;
                        box[Math.floor(i / 3) * 3 + Math.floor(j / 3)] &= ~mask;
                    }
                }
                // if there are no valid values for this cell, return null
                return null;
            }
        }
    }
    // if all cells are filled with valid values, return the solved board
    return data;
}


// Brute force backtrack used for solving knight variant game
// code referenced and edited from: https://www.geeksforgeeks.org/sudoku-backtracking-7/
function solveKnightSudoku(data, row, col)
{
    if (row == undefined) row = 0;
    if (col == undefined) col = 0;

    // if both row and col are 8, meaning the end is reached, stop backtracking
    if (row == 8 && col == 8)
        return true;
  
    // if the final column is reached, move to the next row
    if (col == 9) {
        row++;
        col = 0;
    }
  
    // if the current pos is not 0, move to the next
    if (data[row][col] != 0)
        return solveKnightSudoku(data, row, col + 1);
  
    for(let num = 1; num < 10; num++) {
        
        // check if the number can be placed on the target cell
        if (isMoveSafe(data, row, col, num))
        {
              
            // assign the number to update the board
            data[row][col] = num;
  
            // check for the next number with the next column
            if (solveKnightSudoku(data, row, col + 1))
                return data;
        }
          
        // if this line is reached, meaning the guess is bad, remove the number and try next
        data[row][col] = 0;
    }
    return null;
}

  
// check if the placement of number to target cell is valid
function isMoveSafe(data, row, col, num)
{
      
    // check the row
    for(let x = 0; x <= 8; x++)
        if (data[row][x] == num)
            return false;
  
    // check the column
    for(let x = 0; x <= 8; x++)
        if (data[x][col] == num)
            return false;
  
    // check the box
    let startRow = row - row % 3;
    let startCol = col - col % 3;

    for(let i = 0; i < 3; i++) {
        for(let j = 0; j < 3; j++) {
            if (data[i + startRow][j + startCol] == num) {
                return false;
            }
        }
    }

    // if the move vialates the knight restirction
    if (!isKnightSudokuCurrentlyValid(data)) {
        return false;
    }

    return true;
}

// check if a currently unfinished, or finished board satisfy the knight rules
function isKnightSudokuCurrentlyValid(data) {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            let current = data[i][j];

            if (current == 0) {
                continue;
            }

            for (let k = 0; k < 9; k++) {
                if (data[i][k] === current && k !== j) {
                    return false;
                }
                if (data[k][j] === current && k !== i) {
                    return false;
                }
            }

            // Check the 3x3 subboard
            let rowStart = Math.floor(i / 3) * 3;
            let colStart = Math.floor(j / 3) * 3;
            for (let row = rowStart; row < rowStart + 3; row++) {
                for (let col = colStart; col < colStart + 3; col++) {
                    if (data[row][col] === current && (row !== i || col !== j)) {
                        return false;
                    }
                }
            }

            // Check for knight-move restriction
            if (i - 2 >= 0 && j - 1 >= 0 && data[i - 2][j - 1] === current) {
                return false;
            }
            if (i - 2 >= 0 && j + 1 < 9 && data[i - 2][j + 1] === current) {
                return false;
            }
            if (i - 1 >= 0 && j - 2 >= 0 && data[i - 1][j - 2] === current) {
                return false;
            }
            if (i - 1 >= 0 && j + 2 < 9 && data[i - 1][j + 2] === current) {
                return false;
            }
            if (i + 1 < 9 && j - 2 >= 0 && data[i + 1][j - 2] === current) {
                return false;
            }
            if (i + 1 < 9 && j + 2 < 9 && data[i + 1][j + 2] === current) {
                return false;
            }
            if (i + 2 < 9 && j - 1 >= 0 && data[i + 2][j - 1] === current) {
                return false;
            }
            if (i + 2 < 9 && j + 1 < 9 && data[i + 2][j + 1] === current) {
                return false;
            }
        }
    }
    return true;
}

// code idea inspired and referenced: https://www.sudokuwiki.org/Sudoku_Creation_and_Grading.pdf
function genRandStart() {
    // Create an empty 9x9 board and fill it with 0's
    const board = new Array(9).fill(0).map(() => new Array(9).fill(0));

    // Fill the four starting cells with random numbers to increase randomness
    board[0][0] = Math.floor(Math.random() * 9) + 1;
    board[0][1] = Math.floor(Math.random() * 9) + 1;
    board[0][2] = Math.floor(Math.random() * 9) + 1;
    board[0][3] = Math.floor(Math.random() * 9) + 1;

    // Fill 9 random cells with numbers from 1 to 9
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (Math.random() < 0.1) { // 10% chance to fill the cell with a number
                let value = Math.floor(Math.random() * 9) + 1; // Generate a random number between 1 and 9
                board[i][j] = value; // Set the value of the cell to the generated random number
            }
        }
    }

    return board;
}

// code idea inspired and referenced: https://www.sudokuwiki.org/Sudoku_Creation_and_Grading.pdf
function genSolvedGame() {
    let board;
    do {
        board = genRandStart(); // Generate a random board as a starting point
    } while (solveSudoku(board) === null); // Keep generating random boards until a solvable board is found
    return board;
}

// code idea inspired and referenced: https://www.sudokuwiki.org/Sudoku_Creation_and_Grading.pdf
function genGame() {
    let board = genSolvedGame(); // Generate a solved board

    // Randomly remove cells until the game is still solvable
    const cellsToRemove = Math.floor(Math.random() * 40) + 30; // Generate a random number of cells to remove between 30 and 70
    for (let i = 0; i < cellsToRemove; i++) {
        const row = Math.floor(Math.random() * 9); // Generate a random row index
        const col = Math.floor(Math.random() * 9); // Generate a random column index
        const prevValue = board[row][col]; // Save the value of the cell before removing it
        board[row][col] = 0; // Remove the value of the cell

        // Check if the game is still solvable
        const copy = board.map(row => row.slice()); // Create a copy of the board
        if (solveSudoku(copy) == null) { // If the copied board is unsolvable
            board[row][col] = prevValue; // Put the original value back in the cell
            i--; // Try again with a different cell
        }
    }

    return board; // Return the final puzzle board
}

module.exports = {
    solveSudoku,
    genRandStart,
    genSolvedGame,
    genGame,
    solveKnightSudoku,
    isMoveSafe,
    isKnightSudokuCurrentlyValid
}