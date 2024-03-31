import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import '../App.css';

function CustomNavbar() {
  const [expanded, setExpanded] = useState(false);
  
  useEffect(() => {
    // Function to check if dark mode is preferred by the user
    const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Set the initial theme based on user preference
    document.documentElement.setAttribute('data-bs-theme', prefersDarkMode ? 'dark' : 'light');

    // Event listener for changes in user preference
    const handleThemeChange = (e) => {
      document.documentElement.setAttribute('data-bs-theme', e.matches ? 'dark' : 'light');
    };

    // Add event listener to monitor changes in user preference
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', handleThemeChange);

    // Cleanup function to remove event listener
    return () => {
      window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', handleThemeChange);
    };
  }, []);

  return (
    <>
      <style type="text/css">
        {`
          .navbar-toggler {
            border: none;
          }
        `}
      </style>
      <Navbar expanded={expanded} expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href="/">Palette Match</Navbar.Brand>
          <Navbar.Toggle onClick={() => setExpanded(!expanded)} aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/single-player" onClick={() => setExpanded(false)}>Single Player</Nav.Link>
              <Nav.Link as={Link} to="/multiplayer" onClick={() => setExpanded(false)}>Multiplayer</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default CustomNavbar;
