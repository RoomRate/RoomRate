import React, { useState } from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { Image } from 'react-extras';
import logo from '../../../assets/images/RoomRateLogoInvert.png';
import user from '../../../assets/images/DefaultPFP.png';
import '../../../scss/custom.scss';
import { ProfileModal } from '../../Users/ProfileModal.js';
import { useAuth } from '../../../shared/contexts/AuthContext';

export const Navigation = () => {
  const [ showModal, setShowModal ] = useState(false);
  const { currentUser } = useAuth();

  function handleOpenModal() {
    setShowModal(true);
  }

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
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
      {currentUser ?
        <Nav.Link onClick={handleOpenModal}>
          <Image url={user} alt="Profile" height="30" />
        </Nav.Link> :
        <Nav.Link className="links" href="/login" style={{ color: `white`, fontWeight: `bold` }}>
          Login/Signup</Nav.Link>}
      {showModal &&
        <ProfileModal id={currentUser.id} onClose={handleCloseModal}>
          <h1>Modal Content</h1>
        </ProfileModal>}
    </Navbar>
  );
};
