import React from 'react';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../../../scss/custom.scss';

export const Navigation = () =>
  <Navbar expand="lg" className="border border-1">
    <Container>
      <Navbar.Brand>
        <Link to="/">RoomRate</Link>
        {/* <Image src={logo} alt="RoomRate" height="30" className="mr-3" /> */}
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto">
          <NavDropdown title="Properties" id="properties-dropdown">
            <NavDropdown.Item>
              <Link to="/">List</Link>
            </NavDropdown.Item>
            <NavDropdown.Item>
              <Link to="/property/form">New</Link>
            </NavDropdown.Item>
          </NavDropdown>
          <Nav.Link>
            <Link to="/chat">Roommate Chats</Link>
          </Nav.Link>
          <Nav.Link>
            <Link to="/login">Login</Link>
          </Nav.Link>
          {/* <Nav.Link onClick={logoutUser()}>Logout</Nav.Link> */}
        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar>;
