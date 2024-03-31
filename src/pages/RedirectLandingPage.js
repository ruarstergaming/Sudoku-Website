// Import components 
import React from 'react'
import RedirectLoginForm from '../components/RedirectLoginForm';
import Navigationbar from "../components/LoginNavbar";

// Import images 
import scotland from '../images/scotland.png'

// This function returns the components of the landing page for those who have 
// been redirected to our page to log in 
function RedirectLandingPage() {
  return (
    <div id='outer-container'>

    {/* Contains the navigation bar component  */}
    <header>
      <Navigationbar className='navbar'/>
    </header>

    {/* Div facilitates CSS Grid display  */}
    <div id="login-grid-container" className='grid-container'>
      
      <div id='left-side' className='grid-item'></div>

      {/* Contains main content of the page  */}
      <div id='login-middle-grid' className='middle-grid'>

        {/* Image and form pair */}
        <img id="login-image" src={scotland}></img>
        <RedirectLoginForm />

      </div>

      <div id='right-side' className='grid-item'></div>

    </div>
  </div>
  );
}

export default RedirectLandingPage;
