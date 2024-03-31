// Import components 
import React from 'react';
import Navigationbar from '../components/Navbar';
import CardForSolving from '../components/CardForSolving';
import CardForCreating from '../components/CardForCreating';
import CardForDailyChallenge from '../components/CardForDailyChallenge';

// Import styles
import '../styles/Home.css';

// Import images 
import sudoku from '../images/sudoku.png';
import createSudoku from '../images/edit-tools.png'
import dailyChallenge from '../images/daily-calendar.png'
import MandateLogin from '../components/MandateLogin';

// This function returns the components of the main page of the website 
function Home() {

  return (
      <div className="home" id='outer-container'>

      {/* Script to ensure users are logged in  */}
      <MandateLogin />

        {/* Contains the navigation bar component  */}
        <header>
          <Navigationbar sticky='top' className='navbar'/>
        </header>

        {/* Div to allow display in grid format  */}
        <main className='grid-container' id='home-grid-container'>
          <div className='left-side'></div>

          {/* Contains main content of the page  */}
          <div className='middle-grid' id='home-middle-grid'>

            {/* Image and card pair - brief text, image, and link pertaining to solving puzzles  */}
            <img src={sudoku} className='image' alt='sudoku puzzle'/>
            <CardForSolving className='card' id='home-card-for-solving'/>

            {/* Image and card pair - brief text, image, and link pertaining to creating puzzles  */}
            <CardForCreating className='card' id='home-card-for-creating'/>
            <img src={createSudoku} className='image' id='home-create-puzzle-image' alt='create sudoku puzzle'/>

            {/* Image and card pair - brief text, image, and link pertaining to the daily challenge  */}
            <img src={dailyChallenge} className='image' id='home-daily-challenge-image' alt='daily challenge' />
            <CardForDailyChallenge className='card' id='home-card-for-daily-challenge'/>
          </div> 

          <div className='right-side'></div>
        </main>
      </div>
    );
}

export default Home;