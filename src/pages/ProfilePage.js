// Import components 
import React from 'react'
import Navigationbar from '../components/Navbar';
import MandateLogin from '../components/MandateLogin';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';

// Import styles 
import '../styles/pfp.css'

// Import images 
import profileImg from '../images/profile.png'

// Declaring constants 
const { useEffect, useState } = require("react");
const { serverURL } = require("../components/constants")


// This function returns the components of the user's profile page 
function ProfilePage() {

    const [profileInfo, setProfileInfo] = useState({puzzlesSolved: [], puzzlesRated: [], origin: {}});

  // This ... 
  useEffect(() => {
      async function getProfileInfo() {
          let info = await fetch(serverURL + "/get-profile-info");
          info = await info.json();
            if (JSON.stringify(info['puzzlesSolved']) == JSON.stringify([])) info['puzzlesSolved'] = "nothing yet!"; 
            if (JSON.stringify(info['puzzlesRated']) == JSON.stringify([])) info['puzzlesRated'] = "nothing yet!";
          setProfileInfo(JSON.parse(JSON.stringify(info)));
      }
      getProfileInfo();
  }, [])

  return (
    <div className="pfp" id='outer-container'>

      {/* Script to ensure user is logged in  */}
      <MandateLogin />

      {/* Contains the navigation bar component  */}
      <header>
        <Navigationbar className='navbar'/>
      </header>

      {/* Allows CSS grid display  */}
      <div id='grid-container'>
        <div id='left-side' className='grid-item'></div>

        {/* Div used for display purposes  */}
        <div>
          <div id="pfp-middle-grid">
            <h1 id='pfp-title'>
              Profile
            </h1>

            {/* Card component - a square object with an image, text, and other possible components - 
            helpful to contain components leading to a clean design  */}
            <Card id="pfp-card" border="white" bg="white">
              <Card.Img id="pfp-image" variant="top" src={profileImg} />
              <Card.Body>
                {/* A list containing the user's information  */}
                <ListGroup id="pfp-list-group">
                  <ListGroup.Item>
                    Username: {profileInfo.username}
                  </ListGroup.Item>

                  <ListGroup.Item variant="secondary">
                    Email: {profileInfo.email}
                  </ListGroup.Item>

                  <ListGroup.Item variant="secondary">
                    Origin: {profileInfo.origin.name} (<a href = {profileInfo.origin.url}><i>{profileInfo.origin.url}</i></a>)
                  </ListGroup.Item>

                  <ListGroup.Item >
                    Role: {profileInfo.role}
                  </ListGroup.Item>

                  <ListGroup.Item variant="secondary">
                    Register date: {profileInfo.registerDate}
                  </ListGroup.Item>

                  <ListGroup.Item >
                    Puzzles solved: {profileInfo.puzzlesSolved}
                  </ListGroup.Item>
                  
                  <ListGroup.Item variant="secondary">
                    Puzzles rated: {profileInfo.puzzlesRated}
                  </ListGroup.Item>
                </ListGroup>
                <h6>*some info may be missing if you are from another site in the federation</h6>

                {/* A call to the user to solve more puzzles    */}
                <Button id="pfp-button" variant="primary" href="select-puzzle">Start solving!</Button>
              </Card.Body>
            </Card>
          </div>
        </div>
    
        <div id='right-side' className='grid-item'></div>
      </div>
    </div>
  )
}

export default ProfilePage;