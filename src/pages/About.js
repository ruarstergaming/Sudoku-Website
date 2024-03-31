// Import components 
import React from 'react'
import Navigationbar from '../components/Navbar';
import MandateLogin from '../components/MandateLogin';

// Import styles
import '../styles/About.css';

// Import images 
import about from '../images/programmer.png'
import { Button } from 'react-bootstrap';

// This function returns the contents of the 'About' page 
function About() {
  return (
      <div className="about" id='outer-container'>

      {/* Script that ensures users are logged in  */}
      <MandateLogin />

        {/* Contains the navigation bar component  */}
        <header>
          <Navigationbar className='navbar'/>
        </header>

        {/* Allows CSS Grid display of components  */}
        <div className='grid-container'>
          <div id='left-side' className='grid-item'></div>

          {/* Contains main content of page  */}
          <div id='about-middle-grid' className='middle-grid'>
            <div id="about-middle-container">
              <img id='about-image' src={about} alt='About us' />
              <div id="about-text">
                <h2>About sudoku</h2>
                <br></br>
                <p>Sudoku is a fun puzzle game usually played on a 9x9 grid. 
                  There are many rulesets and variants for sudoku, and some are more challenging than others. 
                  Our site supports both standard sudoku as well as the Knight's Variant!</p>
              </div>
              <br></br>
              <hr id="about-line-break"></hr>
              <br></br>
              <div id="about-text">
                <h3>Standard sudoku rules</h3>
                <br></br>
                <ul id="about-list">
                  <li>Each square on the grid must be populated with a number in the range 1-9</li>
                  <li>The same number may not appear more than once within the same 3x3 section of the grid</li>
                  <li>The same number should also not appear more than once in a row or column across the entire grid</li>
                </ul>
                <br></br>
                <p>This video covers the history of sudoku - for more information on playing sudoku see the <a href = "/fpf06/help">Help</a> section!</p>
                <iframe id="about-vid" src="https://www.youtube.com/embed/3ipNVbxj74s" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
              </div>
              <br></br>
              <hr id="about-line-break"></hr>
              <br></br>
              <div id="about-text">
                <h2>About us</h2>
                <br></br>
                <p>We are a small team (5 people) working hard to deliver the best sudoku site possible! 
                  This site was created as part of our Juniour Honours project for Computer Science at the &nbsp;
                  <a href = "https://www.st-andrews.ac.uk/">University of St Andrews</a>.  
                  We have spent a whole academic year on it and hope this shows!</p>
                <Button onClick = {() => window.location.href = "/fpf06"}>Go and see what the site has to offer!</Button>
              </div>
            </div>
           
          </div>

          <div id='right-side' className='grid-item'></div>
        </div>
      </div>
    );
}
export default About;