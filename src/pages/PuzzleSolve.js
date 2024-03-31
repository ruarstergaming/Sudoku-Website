// Import components 
import Button from 'react-bootstrap/Button';
import Sudoku from "../components/Sudoku";
import Navigationbar from "../components/Navbar";
import PuzzleRate from "../components/PuzzleRate";
import CommentSection from "../components/CommentSection"
import MandateLogin from "../components/MandateLogin";
import { serverURL } from '../components/constants';

// Import styles
import '../styles/Sudoku.css';

// Import images 
import downloadPuzzleImg from '../images/downloadPuzzle.png'

async function downloadPuzzle() {
    window.open(serverURL + "/download-puzzle" + window.location.search) // new window must be opened for download - cannot be same window
}


// This function returns the components required to visualise the solving page
function PuzzleSolve() {
    return (
        <div className="puzzle-solve" id='outer-container'>
        {/* Script to ensure users are logged in  */}
            <MandateLogin />

            {/* Contains the navigation bar component  */}
            <header>
                <Navigationbar className='navbar'/>
            </header>

            {/* Div used to facilitate CSS grid display  */}
            <div className='grid-container'>
                <div id='left-side' className='grid-item'></div>

                {/* Contains main content of the page  */}
                <div className='middle-grid'>

                    {/* Sudoku component - this is used to access the board, etc.  */}
                    <Sudoku />
                    
                    {/* This section contains the comment section, as well as an option to rate 
                    and download the puzzle  */}
                    <div id="sudoku-middle-grid">

                        {/* Allows users to leave comments on a puzzle, as well as view comments left 
                        by other users  */}
                        <CommentSection />
                        <br></br>
                        <hr id="sudoku-line-break"/>

                        {/* Allows users to rate the puzzle they are attempting to solve using a five-star system  */}
                        <PuzzleRate />

                        {/* Allows users to download the puzzle  */}
                        <Button id="download-puzzle" onClick={downloadPuzzle}>Download Puzzle  &nbsp; <img src={downloadPuzzleImg} 
                        style={{width:"20px", height:"20px"}}/> </Button>
                        
                    </div>
                    
                </div>

                <div id='right-side' className='grid-item'>

                </div>
            </div>
        </div>
    );
}



export default PuzzleSolve;