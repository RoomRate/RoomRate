import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';

export const Navigation = () => {
  return (
    <Navbar bg="dark" variant="dark">
      <Navbar.Brand href="/">Uni-Home</Navbar.Brand>
      <Nav className="me-auto">
        <Nav.Link href="/">Properties</Nav.Link>
        <Nav.Link href="/chat">Roommate Chats</Nav.Link>
      </Nav>
    </Navbar>
  )
};