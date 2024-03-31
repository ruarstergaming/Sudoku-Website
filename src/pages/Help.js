// Import components 
import React from 'react'
import MandateLogin from '../components/MandateLogin';
import Navigationbar from '../components/Navbar';

// Import styles
import '../styles/Home.css';

// Import images 
import help from '../images/helping-hand.png'
import { Button } from 'react-bootstrap';


// Returns the 'Help' page 
function Help() {
  return (
    <div className="about" id='outer-container'>

    {/* Script to ensure user is logged in  */}
    <MandateLogin />

      {/* Contains navigation bar component  */}
      <header>
        <Navigationbar className='navbar'/>
      </header>

      {/* Allows display of components in CSS Grid style  */}
      <div className='grid-container'>
        <div id='left-side' className='grid-item'></div>

        {/* Holds the central visual elements of the page  */}
        <div id='help-middle-grid' className='middle-grid'>
          <div>
            <img id='helping-hand-image' src={help} alt='A helping hand' />
            <div id="help-text">
              <h3>What is sudoku?</h3>
              <br></br>
              <p>Sudoku, originally called Number Place, is a logic-based, combinatorial, number-placement puzzle. 
                In classic Sudoku, the objective is to fill a 9 by 9 grid with digits so that each column, each row, and 
                each of the nine 3 by 3 subgrids that compose the grid contain all of the digits from 1 to 9. 
                The puzzle setter provides a partially completed grid, which for a well-posed puzzle has a single solution.</p> 
              <p>Watch the incredibly informative video below to find out more!</p>
            </div>
            <iframe id="help-vid" src="https://www.youtube.com/embed/8zRXDsGydeQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
            <br></br>
            <br></br>
            <p>Want to know more about the origins of sudoku? Visit the <a href = "/fpf06/about">About</a> page to find out more</p>
            <br></br>
            <hr id="help-line-break"></hr>
            <br></br>
            <div id="help-text">
              <h3>But what about Knight's Sudoku?</h3>
              <p>The Knight's Variant is a variant of sudoku with a slightly different ruleset. 
                In addition to the usual constraints, no numbers a "knight's move" (as from chess) away from each other may be equal. 
                This makes them more difficult than traditional puzzles!</p>
              <p>Watch <i>this</i> video below to find out more</p>
            </div>
            <iframe id="help-vid" src="https://www.youtube.com/embed/J2jGJTm4VS8" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
            <br></br>
            <br></br>
            <Button onClick = {() => window.location.href = "/fpf06/select-puzzle"}>Stop thinking and start solving now!</Button>
          </div>
        </div>

        <div id='right-side' className='grid-item'></div>
      </div>
    </div>
    );
}

export default Help;