// Import components 
import MandateLogin from "../components/MandateLogin.js";
import Navigationbar from "../components/Navbar.js";

// Import styles
import '../styles/Home.css';

// Import images 
import UnderConstruction from '../images/under-construction.png';

// This function returns the components necessary to indicate to the user that a 
// section of the website is not yet complete 
function UnderDevelopment() {
  return (
    <div className="puzzle-select" id='outer-container'>
        
        {/* Script used to ensure user is logged in  */}
        <MandateLogin />

        {/* Contains navigation bar component  */}
        <header>
            <Navigationbar sticky='top' className='navbar'/>
        </header>

        {/* Div used to facilitate grid display */}
        <main className='grid-container' id='under-development-grid-container'>

            <div className='left-side'></div>

            {/* Contains the main content of the page  */}
            <div className='middle-grid' id='under-development-middle-grid'>

                {/* Text and image pair to indicate content is not yet available to users  */}
                <h2 id='under-development-title'>This page is currently under development... </h2>
                <img id='under-construction-image' src={UnderConstruction} alt='Under construction' />

            </div> 

            <div className='right-side'></div>

        </main>
    </div>
    );
}

export default UnderDevelopment;