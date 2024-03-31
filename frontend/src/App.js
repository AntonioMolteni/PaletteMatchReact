// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import SinglePlayer from './components/SinglePlayer';
import Multiplayer from './components/Multiplayer';
import Settings from './components/Settings';
import Profile from './components/Profile';
import CustomNavbar from './components/Navbar';
import './App.css';

function App() {
  return (
    <Router>
      <div>
        <nav>
          {/* Navigation Links */}
          <CustomNavbar/>
        </nav>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/single-player" element={<SinglePlayer />} />
          <Route path="/multiplayer" element={<Multiplayer />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
