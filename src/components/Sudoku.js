/*
* Sudoku.js taken and adapted from Kenny Yip Coding, 27th Oct, 2022
* https://www.youtube.com/watch?v=S4uRtTb8U-U&t=555s
*/

import Button from 'react-bootstrap/Button';
import ToggleButton from 'react-bootstrap/ToggleButton';
import React, { useState } from 'react';

// Import styles 
import '../styles/Sudoku.css'

import {serverURL} from './constants';

const {useEffect} = require('react');

let numSelected = null;
let errors = 0;
let solution = [];
let moves = [];
let hints = false;
let variant = "";
let isDaily = false;
let puzzleName = "";

function Sudoku()
{
    const [checked, setChecked] = useState(false);
    const [checkedRemove, setCheckedRemove] = useState(false);
    useEffect(() => {
        async function renderGrid() { 
            await setGame();
        }
        renderGrid();
      }, []);
    return (
    <div id='sudoku-middle-grid'>
        <h1 id='puzzle-type'>{puzzleName}</h1>
        <hr id='sudoku-line-break'/>
        <h2 id="errors">Mistakes: {errors}</h2>
        <ToggleButton id= 'showMistakes' type="checkbox" variant='outline-primary' checked={checked} 
        onChange={(e) => setChecked(e.currentTarget.checked)} onClick={toggleMistakes}>{checked ? 'Hide mistakes' : 'Show mistakes'}</ToggleButton>
        {/* <h2 id={{errors} > 0 ? "errors" : "no-errors"}>Mistakes: {errors}</h2> */}
        <br/>
        <div id = "board" className="board"></div>
        <div id= "digits" className = 'digits'></div>
        <div class="button-row">
            <ToggleButton id="remove-button" type="checkbox" variant="outline-secondary" checked={checkedRemove} 
            onChange={(e) => setCheckedRemove(e.currentTarget.checked)}>Remove</ToggleButton>
            <Button id="undo-button" variant="dark" onClick={undo}>Undo</Button>
            <Button id="clear-button" variant="danger" onClick={restart}>Restart</Button>
        </div>
        <Button variant="primary" id= "submit-button"  onClick= {checkSolution}>
                Submit attempt
            </Button>
        <hr id='sudoku-line-break'/>
        
    </div>
    );
}

/**
 * Toggles the visibility of the mistakes counter. 
 */
function toggleMistakes() {
    let x = document.getElementById("errors");
    if ( window.getComputedStyle(x, null).getPropertyValue("display") === 'none') {
        showMistakeTiles();
        removeHighlight();
        x.style.display = "block";
        hints = true;
    } else {
        removeHighlight();
        hideMistakeTiles();
        x.style.display = "none";
        hints = false;
    }
}

function showMistakeTiles()
{
    let incorrect = document.getElementsByClassName("incorrect");
    for (let i = 0; i < incorrect.length; i++) {
        incorrect[i].classList.add("incorrect-active-hint");        
      }
}

function hideMistakeTiles()
{
    let incorrect = document.getElementsByClassName("incorrect");
    for (let i = 0; i < incorrect.length; i++) {
        incorrect[i].classList.remove("incorrect-active-hint");
    }
}

/**
 * If hints are on, check whether a given cell is correct or not and update the background colour respectively
 * @param {*} row Row of cell
 * @param {*} col Col of cell
 */
function updateMistakeTilesDynamically(row, col)
{
    if (hints)
    {
        let cell = document.getElementById(row + "-" + col);
        //cell.classList.remove("incorrect");
        cell.classList.add("incorrect-active-hint");
        if (cell.innerText === solution[row][col].toString() || cell.innerText === "")
            cell.classList.remove("incorrect-active-hint");
        else
        {
            cell.classList.add("incorrect");
            cell.classList.add("incorrect-active-hint");
        }
            
    }
}

/**
 * Alert the user if the puzzle is valid when submit is clicked
 */
async function checkSolution() {
    let response = await submitAttempt();
    if (response['valid']) {
        alert("Correct!")
    } else {
        alert("Incorrect solution!");
    }
}

/**
 * Submits the attempt
 * @returns 
 */
async function submitAttempt() {
    let board = await collectBoard();
    let attemptObj = {
        "id": isDaily ? "" : window.location.search.split("=")[1],
        "variant": variant,
        "data": board,
        "isDaily": isDaily
    };
    let response = await fetch(serverURL + "/query-solution", {
        method: "POST",
        mode: "cors",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(attemptObj)
    });
    return await response.json();

}

async function restart()
{
    removeHighlight();
    for (let i = 0; i < 9; i++)
    {
        for (let j= 0; j < 9; j++)
        {
            let elem = document.getElementById(i.toString() + "-" + j.toString());
            if (!elem.classList.contains("tile-start"))
            {
                elem.innerHTML = "";
                elem.classList.remove("incorrect");
                elem.classList.remove("incorrect-active-hint");
                updateMistakeTilesDynamically(i, j);
            }
        }
    }
    errors = 0;
    moves.length = 0;
    updateErrorText();
}

async function undo()
{
    if (moves.length !== 0)
    {
        removeHighlight();        
        var last = moves.pop();
        var row = last[0];
        var col = last[1];
        var revertTo = last[2]; //Number to revert to
        var current = last[3];
        var element = document.getElementById(row + "-" + col);
        element.innerHTML = revertTo;
        if (revertTo === "" || revertTo === solution[row][col])
        {
            element.classList.remove("incorrect");
            element.classList.remove("incorrect-active-hints");
        }
        updateErrorText();
        updateMistakeTilesDynamically(row, col);
    }
}

/**
 * Gets the current state of the board
 * @returns 9x9 2D array board
 */
 async function collectBoard() {
    let board = [];
    for (let i = 0; i < 9; i++) {
        board.push([]);
    }
    let indexes = [];
    let value = 0;
    for (let child of document.getElementById('board').children) {
        indexes = child.id.split("-");
        value = parseInt(child.innerText);
        if (isNaN(value)) {
            value = 0;
        }
        board[parseInt(indexes[0])][parseInt(indexes[1])] = value;
    }
    return board;
}

/**
 * Gets the board and solution from the database
 * @returns A json response with the puzzle and solution to the puzzle
 */
async function getBoard() {
    var url = "";
    if (window.location.pathname === "/fpf06/daily-challenge") {
        url = serverURL + "/get-daily-challenge";
    } else {
        url = serverURL + "/get-puzzle" + window.location.search;
    }
    const response = await fetch(url);
    if (!response.ok) {
        window.alert("Failed to load puzzle!");
    } else {
        let entry = await response.json();
        return entry;
    }
}

/**
 * Calls other functions required to set the visuals for the page
 */
async function setGame()
{
    let puzzleInfo = await getBoard();
    let board = puzzleInfo['puzzle'];
    solution = puzzleInfo['solution'];
    await setDigits();
    await setBoard(board);
    variant = puzzleInfo['variant'];
    isDaily = puzzleInfo['isDaily'];
    puzzleName = puzzleInfo['name'];
    await setRemove();
    if (puzzleInfo['solved']) {
        alert("You have solved this before! Feel free to solve as many times as you'd like!");
    }
    document.getElementById("puzzle-type").innerHTML = puzzleName;
}

/**
 * Create the number pad
 */
function setDigits()
{
    for (let a = 1; a <= 9; a++)
    {
        let number = document.createElement("div");
        number.id = a;
        number.innerText = a;
        number.addEventListener("click", selectNumber);
        number.classList.add("number");
        document.getElementById("digits").appendChild(number);
    }
}

function setRemove()
{
    let removeButton = document.getElementById("remove-button");
    removeButton.addEventListener("click", selectNumber);
}

/**
 * Set up the Sudoku board
 * @param {*} board a 9x9 2D array of numbers to populate the Sudoku board
 */
function setBoard(board)
{
    for (let i = 0; i < 9; i++)
    {
        for (let j= 0; j < 9; j++)
        {
            let tile = document.createElement("div");
            tile.id = i.toString() + "-" + j.toString();
            if (board[i][j] !== 0)
            {
                tile.innerText = board[i][j];
                tile.classList.add("tile-start");
            }
            tile.addEventListener("click", selectTile);
            tile.classList.add("tile");
            document.getElementById("board").append(tile);
            if (i === 2 || i === 5) {
                tile.classList.add("horizontal-line");
            }
            if (j === 2 || j === 5) {
                tile.classList.add("vertical-line");
            }
        }
    }
}

/**
 * Changes the variable numSelected to the selected number on the numpad
 * @param {*} event click
 */
function selectNumber(event)
{
    if (numSelected === event.target)
    {
        numSelected.classList.remove("number-selected");
        numSelected = null;
        return;
    }    
    if (numSelected != null) {
        numSelected.classList.remove("number-selected");
    }
    numSelected = event.target;
    numSelected.classList.add("number-selected");
}

/**
 * Changes the value of a sudoku tile to the value selected on the number pad
 * @param {*} event click
 */
function selectTile(event)
{
    if (event.target.classList.contains("selected"))
    {
        removeHighlight();
        return;
    }
    removeHighlight();
    let coords = event.target.id.split("-");
    let row = parseInt(coords[0]);
    let col = parseInt(coords[1]);
    let current = event.target.innerText;
    if (numSelected)
    {
        // Exit the function if the tile is a starting tile
        if (event.target.classList.contains("tile-start"))
            return;

        if (numSelected.id !== "remove-button")
            event.target.innerText = numSelected.id;
        else
        {
            event.target.innerText = '';
            event.target.classList.remove("incorrect");
        }     

        // tuple of row, col, old item inside, new item.
        let tuple = [row, col, current, numSelected.id];

        moves.push(tuple);
        // If the current square is empty or if the current square is a correct solution
        if (current === "" || current === solution[row][col].toString()) 
        {
            // If the new value of a square is not a solution
            if (event.target.innerText !== solution[row][col].toString())
            {
                event.target.classList.add("incorrect");
            }
        }
        // If the current square is not the correct solution
        else
        {
            // If the new value of a square is updated to the correct solution
            if (event.target.innerText === solution[row][col].toString())
            {
                event.target.classList.remove("incorrect");
            }
        }
        updateErrorText();
        updateMistakeTilesDynamically(row, col);
    }
    else
    {
        highlight(row, col);
    }
}

/**
 * Highlights the selected square, squares in the same row, column, and grid
 * @param {*} row 
 * @param {*} col 
 */
function highlight(row, col)
{
    //highlight all cells with same row & col
    for (let i = 0; i < 9; i++)
    {
        let proxyRow = document.getElementById(row + "-" + i);
        let proxyCol = document.getElementById(i + "-" + col);
        assignHighlight(proxyRow);
        assignHighlight(proxyCol);
    }

    //highlight all cells within same 3x3 grid
    let rowBox = Math.floor(row / 3);
    let colBox = Math.floor(col / 3);

    let rowAdd = 0;
    switch (rowBox)
    {
        case 1:
            rowAdd = 3;
            break;
        case 2:
            rowAdd = 6;
            break;
        default:
            break;
    }

    let colAdd = 0;
    switch (colBox)
    {
        case 1:
            colAdd = 3;
            break;
        case 2:
            colAdd = 6;
            break;
        default:
            break;
    }
    for (let i = 0; i < 3; i++)
    {
        let proxyRow = i + rowAdd;
        for (let j = 0; j < 3; j++)
        {
            let proxyCol = j + colAdd;
            let proxy = document.getElementById(proxyRow + "-" + proxyCol);
            assignHighlight(proxy);
        }
    }

    let selected = document.getElementById(row + "-" + col);
    selected.classList.remove("proxy");
    selected.classList.remove("tile-start-proxy");
    if (selected.classList.contains("incorrect-proxy"))
    {
        selected.classList.add("selected-incorrect");
        selected.classList.remove("incorrect-proxy");
    } 
    else
        selected.classList.add("selected");

    if (variant === "knights-sudoku")
    {
        let upOne = row - 1;
        let downOne = row + 1;
        let leftOne = col - 1;
        let rightOne = col + 1;

        let upTwo = upOne - 1;
        let downTwo = downOne + 1;
        let leftTwo = leftOne - 1;
        let rightTwo = rightOne + 1;

        let proxy = document.getElementById(upOne + "-" + leftTwo);
        if (proxy !== null)
            assignHighlight(proxy);

        proxy = document.getElementById(upOne + "-" + rightTwo);
        if (proxy !== null)
            assignHighlight(proxy);

        proxy = document.getElementById(downOne + "-" + leftTwo);
        if (proxy !== null)
            assignHighlight(proxy);

        proxy = document.getElementById(downOne + "-" + rightTwo);
        if (proxy !== null)
            assignHighlight(proxy);

        proxy = document.getElementById(upTwo + "-" + leftOne);
        if (proxy !== null)
            assignHighlight(proxy);
    
        proxy = document.getElementById(upTwo + "-" + rightOne);
        if (proxy !== null)
            assignHighlight(proxy);
    
        proxy = document.getElementById(downTwo + "-" + leftOne);
        if (proxy !== null)
            assignHighlight(proxy);
    
        proxy = document.getElementById(downTwo + "-" + rightOne);
        if (proxy !== null)
            assignHighlight(proxy); 
    }
}

function assignHighlight(proxy)
{
    if(proxy.classList.contains("tile-start"))
        proxy.classList.add("tile-start-proxy");
    else if(proxy.classList.contains("incorrect-active-hint"))
    {
        proxy.classList.add("incorrect-proxy");
        proxy.classList.remove("incorrect-active-hint");
    }
    else
        proxy.classList.add("proxy");
}

function removeHighlight()
{
    for (let i = 0; i < 9; i++)
    {
        for (let j = 0; j < 9; j++)
        {
            let classList = document.getElementById(i + "-" + j).classList;
            classList.remove("proxy");
            classList.remove("tile-start-proxy");
            classList.remove("selected");
            if (classList.contains("incorrect-proxy"))
            {
                classList.add("incorrect-active-hint");
                classList.remove("incorrect-proxy");
            }
            else if (classList.contains("selected-incorrect"))
            {
                classList.add("incorrect-active-hint");
                classList.remove("selected-incorrect");
            }
        }
    }
}

function updateErrorText()
{
    
    errors = 0;
    for (let i = 0; i < 9; i++)
    {
        for (let j = 0; j < 9; j++)
        {
            let classList = document.getElementById(i + "-" + j).classList;
            if (classList.contains("incorrect"))
            {
                errors++;
            }
        }
    }
    document.getElementById("errors").innerText = ("Mistakes: " + errors);

    /**
     * Changes the colour of the mistakes counter depending on the 
     * number of errors.
     */
    if (errors > 0) {
        document.getElementById("errors").style.color = "red"
    } else {
        document.getElementById("errors").style.color = "black"
    }
}

export default Sudoku;
export {highlight, removeHighlight};