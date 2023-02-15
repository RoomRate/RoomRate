import React from 'react';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import '../../../scss/custom.scss';
import { useAuth } from '../../../shared/contexts/AuthContext';

export const Navigation = () => {
  const { logout } = useAuth();

  const logoutUser = () => logout();

  return (
    <Navbar expand="lg" className="border border-1">
      <Container>
        <Navbar.Brand href="/">
          {/* <Image src={logo} alt="RoomRate" height="30" className="mr-3" /> */}
          RoomRate
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            <NavDropdown title="Properties" id="properties-dropdown">
              <NavDropdown.Item href="/">List</NavDropdown.Item>
              <NavDropdown.Item href="/property/form">New</NavDropdown.Item>
            </NavDropdown>
            <Nav.Link href="/chat">Roommate Chats</Nav.Link>
            <Nav.Link href="/login">Login</Nav.Link>
            <Nav.Link onClick={logoutUser()}>Logout</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>);
};
