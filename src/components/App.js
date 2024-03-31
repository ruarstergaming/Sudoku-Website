// Import react.js setup
import React from 'react';
import {Route, Routes, BrowserRouter} from 'react-router-dom'

// Import pages
import About from '../pages/About';
import Help from '../pages/Help';
import Home from '../pages/Home';
import Login from "../pages/Login";
import Register from "../pages/Register";
import PageNotFound from "../pages/PageNotFound"
import PuzzleCreate from '../pages/PuzzleCreate';
import PuzzleSolve from '../pages/PuzzleSolve';
import PuzzleSelect from '../pages/PuzzleSelect';
import UnderDevelopment from '../pages/UnderDevelopment';
import ForeignLogin from "../pages/ForeignLogin";
import RedirectLandingPage from '../pages/RedirectLandingPage';
import ProfilePage from '../pages/ProfilePage';
import DailyChallenge from '../pages/DailyChallenge';

function App() {

  return (
    <BrowserRouter basename = {'/fpf06'}>
      <Routes>
        <Route path = "/" element = {<Home />} />
        <Route path = "/about" element = {<About />} />
        <Route path = "/help" element = {<Help />} />
        <Route path = "/login" element = {<Login />} />
        <Route path = "/register" element = {<Register />} />
        <Route path = "/create-puzzle" element = {<PuzzleCreate />} />
        <Route path = "/solve-puzzle" element = {<PuzzleSolve />} />
        <Route path = "/select-puzzle" element = {<PuzzleSelect />} />
        <Route path = "/daily-challenge" element = {<DailyChallenge />} />
        <Route path = "/foreign-login" element = {<ForeignLogin />} />
        <Route path = "/redirect-landing" element = {<RedirectLandingPage />} />
        <Route path = "/profile" element = {<ProfilePage />} />
        <Route path = "*" element = {<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
