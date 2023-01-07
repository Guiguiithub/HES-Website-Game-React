//import logo from './logo.svg';
//import React, { Component } from 'react';
import './Css/App.css';
import './Css/smartphone.css';
import Description from "./Pages/Description";
import Mockup from './Pages/Mockup';
import Flow from './Pages/Flow';
import Logbook from './Pages/Logbook';
import Game from './Pages/game';

import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link
} from "react-router-dom" ;

export default function PageAndling() {
  return (
    <Router>
        <div>
        <header>
            <h1>HES-SO Vs - 624-2 - HTML/CSS/JavaScript</h1>
            <nav>
                <input type="checkbox" id="hamburger"/>
                <label for="hamburger"><img src="hamburger_icon.svg"></img></label>
                <ul>
                    <li>
                        <Link to="/">Description</Link>
                    </li>
                    <li>
                        <Link to="/mockup">Mockup</Link>
                    </li>
                    <li>
                        <Link to="/flow">Flow</Link>
                    </li>
                    <li>
                        <Link to="/logbook">Logbook</Link>
                    </li>
                    <li>
                        <Link to="/game">NSE</Link>
                    </li>
                </ul>
                <hr />
                </nav>
            </header>
            <Routes>
                    <Route path="/" element={<Description/>}></Route>
                </Routes>
                <Routes>
                    <Route path="/mockup" element={<Mockup/>}></Route>
                </Routes>
                <Routes>
                    <Route path="/flow" element={<Flow/>}></Route>
                </Routes>
                <Routes>
                    <Route path="/logbook" element={<Logbook/>}></Route>
                </Routes>
            <footer>
                <img id="logo" src="logo.png"></img>
            </footer>
        </div>
    </Router>
  )
}
