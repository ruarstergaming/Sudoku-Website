// Import components 
import ForeignLoginForm from "../components/ForeignLoginForm"
import Navigationbar from "../components/LoginNavbar";
import Button from 'react-bootstrap/Button'

// Import images 
import foreignLoginImage from '../images/foreignLoginImage.png'

// Import styles
import '../styles/Home.css'

// This function returns the foreign login page 
function ForeignLogin() {
    return (
        <div id='fl-outer-container'>
            
            {/* Contains the navigation bar component  */}
            <header>
                <Navigationbar className='navbar'/>
            </header>

            {/* Grid container allows display of components in CSS Grid style  */}
            <div id="fl-grid-container" className='grid-container'>
                <div id='left-side' className='grid-item'></div>
        
                {/* Main content of the page  */}
                <div id='fl-middle-grid' className='middle-grid'>
                    <img id="fl-image" src={foreignLoginImage}/>
                    <ForeignLoginForm/>
                    <Button id="fl-return-button" href="/fpf06/login" variant="secondary" size="sm">Return to login</Button>{' '}
                </div>
        
                <div id='right-side' className='grid-item'></div>
            </div>
      </div>
    );
}

export default ForeignLogin;