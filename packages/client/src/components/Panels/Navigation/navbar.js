import React from 'react';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../../../scss/custom.scss';

export const Navigation = () =>
  <Navbar expand="lg" className="border border-1">
    <Container>
      <Navbar.Brand>
        <Link to="/" className="links">RoomRate</Link>
        {/* <Image src={logo} alt="RoomRate" height="30" className="mr-3" /> */}
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto">
          <NavDropdown title="Properties" id="properties-dropdown" style={{ color: `black` }}>
            <NavDropdown.Item>
              <Link to="/" className="links">List</Link>
            </NavDropdown.Item>
            <NavDropdown.Item>
              <Link to="/property/form" className="links">New</Link>
            </NavDropdown.Item>
          </NavDropdown>
          <Nav.Link>
            <Link to="/chat" className="links">Roommate Chats</Link>
          </Nav.Link>
          <Nav.Link>
            <Link to="/login" className="links">Login</Link>
          </Nav.Link>
          {/* <Nav.Link onClick={logoutUser()}>Logout</Nav.Link> */}
          <Nav.Link>
            <Link to="/test" className="links">Test</Link>
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar>;
