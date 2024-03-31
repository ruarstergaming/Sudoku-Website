// Import components 
import MandateLogin from "../components/MandateLogin";
import Navigationbar from "../components/Navbar";

const { default: Sudoku } = require("../components/Sudoku");

// This function returns the contents of the Daily Challenge page 
function DailyChallenge() {
    return (
        <div className="puzzle-solve" id='outer-container'>
        
        {/* Script to ensure user is logged in */}
        <MandateLogin />

            {/* Contains navigation bar component  */}
            <header>
                <Navigationbar className='navbar'/>
            </header>

            {/* Allows display of contents in CSS Grid format  */}
            <div className='grid-container'>
                <div id='left-side' className='grid-item'></div>

                <div className='middle-grid'>

                    {/* Sudoku component - main interaction users will have  */}
                    <Sudoku />
                    <div id="sudoku-middle-grid">
                    </div>
                </div>

                <div id='right-side' className='grid-item'>
                </div>
            </div>
        </div>
    )
}

export default DailyChallenge;