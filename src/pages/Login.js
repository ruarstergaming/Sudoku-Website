// Import components 
import LoginForm from "../components/LoginForm"
import Navigationbar from "../components/LoginNavbar";
import Button from 'react-bootstrap/Button'

// Import images 
import scotland from '../images/scotland.png'

// Import styles
import '../styles/Login.css';

// This function returns the contents of the login page 
function Login() {
  return (
    <div id='outer-container'>

      {/* Contains the navigation bar component  */}
      <header>
        <Navigationbar className='navbar'/>
      </header>

      {/* Div used to display content in grid format  */}
      <div id="login-grid-container" className='grid-container'>
        <div id='left-side' className='grid-item'></div>

        {/* Main content of the page  */}
        <div id='login-middle-grid' className='middle-grid'>

          {/* Image and form pair, linking visual indicator to functionality  */}
          <img id="login-image" src={scotland}></img>
          <LoginForm id='login-form'/>

          {/* Both buttons contained in a single div for inline display  */}
          <div>
            <Button id="login-create-button"variant="secondary" size="sm" href="/fpf06/register">Create account</Button>
            <Button id="login-foreign-button"variant="secondary" size="sm" href="/fpf06/foreign-login">Foreign login</Button>
          </div>
        </div>

        <div id='right-side' className='grid-item'></div>
      </div>
    </div>
  );
}

export default Login;