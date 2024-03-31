// Import components 
import RegisterForm from "../components/RegisterForm";
import Navigationbar from "../components/LoginNavbar";
import Button from 'react-bootstrap/Button'

// Import images 
import verify from '../images/verify.png'

// This function returns the components which allow a user to register 
// themselves on our website 
function Register() {
        
    return (
        <div id='outer-container'>

          {/* Contains navigation bar component  */}
          <header>
            <Navigationbar className='navbar'/>
          </header>

          {/* Div used to facilitate grid display  */}
          <div id="register-grid-container" className='grid-container'>

            <div id='left-side' className='grid-item'></div>
    
            {/* Contains the main content of the page  */}
            <div id='register-middle-grid' className='middle-grid'>

              <img id="register-image" src={verify}/>
              <RegisterForm />
              <Button id="register-return-button" href="/fpf06/login" variant="secondary" size="sm">Return to login</Button>{' '}
              
            </div>
    
            <div id='right-side' className='grid-item'></div>

          </div>
        </div>
      );
}

export default Register;