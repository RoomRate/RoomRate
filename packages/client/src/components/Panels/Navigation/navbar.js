import React from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { Image } from 'react-extras';
import logo from '../../../assets/images/RoomRateLogoInvert.png';
import '../../../scss/custom.scss';

export const Navigation = () =>
  <Navbar expand="lg" className="px-4">
    <Navbar.Brand>
      <Nav.Link href="/"><Image url={logo} alt="RoomRate" height="30" className="mr-3" /></Nav.Link>
    </Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="ml-auto">
        <NavDropdown title="Properties" id="properties-dropdown">
          <Nav.Link href="/">List</Nav.Link>
          <Nav.Link href="/property/form" className="links">New</Nav.Link>
        </NavDropdown>
        <NavDropdown title="Roommates">
          <Nav.Link href="/chat">Roommate Chats</Nav.Link>
          <Nav.Link href="/roommate-finder">Roommate Finder</Nav.Link>
        </NavDropdown>
      </Nav>
    </Navbar.Collapse>
  </Navbar>;
