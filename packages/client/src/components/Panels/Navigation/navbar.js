import React from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';

export const Navigation = () =>
  <Navbar bg="dark" variant="dark">
    <Navbar.Brand href="/">Uni-Home</Navbar.Brand>
    <Nav className="me-auto">
      <NavDropdown title="Properties">
        <NavDropdown.Item href="/">List</NavDropdown.Item>
        <NavDropdown.Item href="/property/form">New</NavDropdown.Item>
      </NavDropdown>
      <Nav.Link href="/chat">Roommate Chats</Nav.Link>
    </Nav>
  </Navbar>;
