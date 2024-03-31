// Import components 
import Table from "../components/Table.js"
import Navigationbar from "../components/Navbar.js";
import PuzzleForm from "../components/PuzzleForm.js";
import MandateLogin from "../components/MandateLogin.js";

// Import styles
import '../styles/PuzzleSelect.css';

// This function returns the components of the puzzle selection page
function PuzzleSelect() {
  return (
    <div className="puzzle-select" id='outer-container'>
    
      {/* Script to ensure users are logged in  */}
      <MandateLogin />

      {/* Contains navigation bar component  */}
      <header>
        <Navigationbar sticky='top' className='navbar'/>
      </header>

      {/* Div used to faciliate CSS Grid display  */}
      <main className='grid-container' id='puzzle-select-grid-container'>
        <div className='left-side'></div>

        {/* Contains main contents of the page  */}
        <div className='middle-grid' id='puzzle-select-middle-grid'>

          <h2>Select a puzzle: </h2>

          {/* A table is displayed if the screen is large enough to allow it, letting 
          users select specific puzzles  */}
          <div id='puzzle-table'>
            <Table/>
          </div>

          {/* If a smaller screen is being used, the user will be shown a form to fill out 
          instead, allowing the user to specify their puzzle requirements - once the form
          is filled out, they will be taken to a puzzle that satisfies their requirements, 
          if it exists  */}
          <div id="puzzle-form">
            <PuzzleForm/>
          </div>

        </div> 

        <div className='right-side'></div>
      </main>
    </div>
    );
}

export default PuzzleSelect;