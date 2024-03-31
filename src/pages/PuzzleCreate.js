// Import components 
import Navigationbar from '../components/Navbar'
import Button from 'react-bootstrap/Button';
import Select from 'react-select';
import {serverURL} from '../components/constants';
import MandateLogin from '../components/MandateLogin';
import {highlight, removeHighlight} from '../components/Sudoku';
import {useState} from 'react'
import {FilePicker} from 'react-file-picker';

// Import styles 
import '../styles/Sudoku.css'

// Declaring variables 
const {useEffect} = require('react');
var numSelected = null;
var board = Array(9).fill(Array(9));
var moves = []

const options = [
    {value: 'easy', label: "Easy"},
    {value: 'medium', label: "Medium"},
    {value: 'hard', label: "Hard"}
];

const variant_options = [
    {value: 'sudoku', label: "Traditional Sudoku"},
    {value: 'knights-sudoku', label: "Knight's Move Sudoku"}
]

let currentValue = "";
let currentVariant = "";



function PuzzleCreate() {

    const [filename, setFilename] = useState("(none)");
    const [file, setFile] = useState(null);

    useEffect(() => {
        setCreatorSpace();
    }, [])

    let layout = (
        <div className="puzzle-solve" id='outer-container'>
        
        {/* Script to ensure user is logged in  */}
        <MandateLogin />

            {/* Contains the navigation bar component  */}
            <header>
                <Navigationbar className='navbar'/>
            </header>

            {/* Used to facilitate grid display */}
            <div className='grid-container'>

                <div id='left-side' className='grid-item'></div>

                <div className='middle-grid'>

                    {/* Contains the main sudoku puzzle creation components  */}
                    <div id="sudoku-middle-grid">
                        <h1>Create a Sudoku Puzzle</h1>
                        <br/>

                        <div id = "board_create" className='board'></div>
                        <br/>

                        <div id= "digits_create" className = 'digits'></div>

                        {/* Contains the three operational buttons beneath the sudoku board, 
                        which aid in puzzle creation  */}
                        <div class="button-row">

                            {/* Allows removal of digits from board when selected  */}
                            <div id="remove-button">
                                Remove
                            </div>

                            {/* Allows users to undo their last action  */}
                            <Button id="undo-button" variant="dark" onClick={undo}>
                                Undo
                            </Button>

                            {/* Allows users to clear the board  */}
                            <Button id="clear-button" variant="danger" onClick={restart}>
                                Restart
                            </Button>

                        </div>
                        <br/>
                        
                    </div>

                    {/* Contains the options of submission such as percieved difficulty of the puzzle, 
                    type of puzzle created, and the ability for users to upload files containing a puzzle*/}
                    <div id="sudoku-middle-grid">

                        {/* A dropdown selector field so users can select the type of their puzzle  */}
                        <p>Select the type of puzzle you have created</p>
                        <Select id = "variant" options={variant_options} onChange = {(event) => {handleVariantChange(event)}} />
                        <br></br>

                        {/* A dropdown selector field so users can select the percieved difficutly of their puzzle  */}
                        <p>Select the difficulty you feel matches your puzzle</p>
                        <Select id = "difficulty" options={options} onChange = {(event) => {handleChange(event)}} />
                        <br></br>

                        {/* The button used to submit their creation  */}
                        <Button variant="primary" id= "creation-submit" onClick= {submitPuzzle}>Submit creation</Button>

                        {/* Visual separation line  */}
                        <hr id="sudoku-line-break"></hr>

                        {/* This section allows users to upload a puzzle in txt or Json format  */}
                        <h5>Upload a file '{filename}'</h5>
                        <FilePicker extensions={['json', 'txt']} onChange={handleFileChange} onError={err => alert("Error! " + err)}>
                            <Button variant="secondary" >Select file</Button>
                        </FilePicker>
                        <br></br>
                        <Button id="upload" onClick={uploadPuzzleFromFile}>Upload file</Button>

                    </div>
                </div>

                <div id='right-side' className='grid-item'></div>
                
            </div>
        </div>
    );


    function handleFileChange(file) {
        setFile(file);
        setFilename(file.name);
    }

    function uploadPuzzleFromFile() {
        let reader = new FileReader();
        reader.onload = async function(event) {
            let text = event.target.result;
            let res = await fetch(serverURL + "/upload-puzzle", {
                method: "POST",
                mode: "cors",
                headers: { "Content-Type": "application/json" },
                body: text // validation done at server
            });
            res = await res.json();
            if (res.added) {
                alert("Puzzle succesfully uploaded!");
            } else {
                alert("Puzzle couldn't be uploaded. " + res.reason);
            }
        }
        reader.readAsText(file);
    }

    return layout;
}

/**
 * Function to call other functions to setup the page
 */
async function setCreatorSpace()
{
    setDigits();
    setBoard();
    setRemove();
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
        document.getElementById("digits_create").appendChild(number);
    }
}

/**
 * Create the empty 9x9 board
 */
function setBoard()
{
    for (let i = 0; i < 9; i++)
    {
        for (let j= 0; j < 9; j++)
        {
            let tile = document.createElement("div");
            tile.id = i.toString() + "-" + j.toString();
            tile.addEventListener("click", selectTile);
            tile.classList.add("tile");
            document.getElementById("board_create").append(tile);
            if (i === 2 || i === 5) {
                tile.classList.add("horizontal-line");
            }
            if (j === 2 || j === 5) {
                tile.classList.add("vertical-line");
            }
        }
    }
}

function setRemove()
{
    let removeButton = document.getElementById("remove-button");
    removeButton.addEventListener("click", selectNumber);
}


/**
 * Changes the variable numSelected to the selected number on the numpad
 * @param {*} event click
 */
function selectNumber()
{
    if (numSelected === this)
    {
        numSelected.classList.remove("number-selected");
        numSelected = null;
        return;
    }
    if (numSelected != null)
        numSelected.classList.remove("number-selected");
    numSelected = this;
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
    let coords = this.id.split("-");
    let row = parseInt(coords[0]);
    let col = parseInt(coords[1]);
    let current = event.target.innerText;
    if (numSelected)
    {
        if (numSelected.id !== "remove-button")
        {
            this.innerText = numSelected.id;
            this.classList.add("tile-start");
        }
        else
        {
            this.innerText = '';
            this.classList.remove("tile-start");
        }
        
        let tuple = [row, col, current, numSelected.id];
        moves.push(tuple);

        board[row][col] = numSelected.id;
    }
    else
    {
        highlight(row, col);
    }
}
async function collectBoard() {
    let board = [];
    for (let i = 0; i < 9; i++) {
        board.push([]);
    }
    let indexes = []; 
    let value = 0;
    for (var child of document.getElementById('board_create').children) {
        indexes = child.id.split("-");
        value = parseInt(child.innerText);
        if (isNaN(value)) {
            value = 0;
        }
        board[parseInt(indexes[0])][parseInt(indexes[1])] = value;
    }
    return board;
}

async function submitPuzzle() {
    // Algorithm to check if a puzzle is valid
    let board = await collectBoard();
    if (!validateBoard(board)) {
        alert('Invalid puzzle - ensure it has at least 17 starting tiles and is not full');
    } else if (currentValue === "") {
        alert("Select a difficulty!");
    } else if (currentVariant === "") {
        alert("Select a variant type!");
    }
    else {
        let response = await sendPuzzle(board);
        if (response['added']) {
            alert('Added puzzle!');
        } else {
            alert('Failed to add puzzle - unsolvable or already exists');
        }
    } 
}

async function sendPuzzle(board) {
    let response = await fetch(serverURL + '/add-puzzle', {
        method: "POST",
        mode: "cors",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({"puzzle": board, "difficulty": currentValue, "variant": currentVariant})
    });
    return await response.json();
}

function validateBoard(board) {
    let startingTiles = 0;
    let tilesVisited = 0;
    for (let column of board) {
        for (let row of column) {
            if (!isNaN(row) && row !== 0) { // if non-zero number
                startingTiles++;
            }
            tilesVisited++;
        }
    }
    if (startingTiles < 17) {
        return false;
    } else if (startingTiles === tilesVisited) {
        return false;
    } else {
        return true;
    }
}

function handleChange(event) {
    currentValue = event['value']
}

function handleVariantChange(event) {
    currentVariant = event['value'];
}

async function undo()
{
    if (moves.length !== 0)
    {
        var last = moves.pop();
        var row = last[0];
        var col = last[1];
        var revertTo = last[2]; //Number to be revereted to
        document.getElementById(row + "-" + col).innerHTML = revertTo;
        if (revertTo === '')
            document.getElementById(row + "-" + col).classList.remove("tile-start");
    }
}

async function restart()
{
    while (moves.length !== 0)
    {   
        undo()
    }
}

export default PuzzleCreate;