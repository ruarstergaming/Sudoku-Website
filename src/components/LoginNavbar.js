import React from 'react';
import { Container, Navbar } from 'react-bootstrap';

function Navigationbar() {
    return (
        <Navbar className='justify-content-center' fixed='top' bg="light" expand="lg" id='login-navbar' >
        <Container id='login-navbar' className='justify-content-center'>
            {/* <Navbar.Brand>Fantastic Puzzles Fife</Navbar.Brand> */}
            <Navbar.Brand>Fantastic Puzzles Fife</Navbar.Brand>
            <Navbar.Text></Navbar.Text>
        </Container>
        </Navbar>
    );
}

export default Navigationbar;
