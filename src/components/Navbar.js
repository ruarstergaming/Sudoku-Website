import React from 'react';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';

function Navigationbar() {
    return (
        <Navbar fixed='top' bg="light" expand="lg" >
        <Container>
            <Navbar.Brand href="/fpf06">Fantastic Puzzles Fife</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
                <Nav.Link href="/fpf06">Home</Nav.Link>
                <Nav.Link href="/fpf06/profile">Profile</Nav.Link>
                <Nav.Link href="/fpf06/daily-challenge">Daily challenge</Nav.Link>
                <NavDropdown title="Puzzles" id="basic-nav-dropdown">
                    <NavDropdown.Item href="/fpf06/create-puzzle">Create a puzzle</NavDropdown.Item>
                    <NavDropdown.Item href="/fpf06/select-puzzle">Select a puzzle</NavDropdown.Item>
                </NavDropdown>
                <Nav.Link href="/fpf06/about">About</Nav.Link>
                <Nav.Link href="/fpf06/help">Help</Nav.Link>
                <Nav.Link href="/fpf06/login">Logout</Nav.Link>
            </Nav>
            </Navbar.Collapse>
        </Container>
        </Navbar>
    );
}

export default Navigationbar;
