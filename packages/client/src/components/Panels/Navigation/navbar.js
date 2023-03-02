import React, { useState } from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { Image } from 'react-extras';
import logo from '../../../assets/images/RoomRateLogoInvert.png';
import user from '../../../assets/images/DefaultPFP.png';
import '../../../scss/custom.scss';
import { ProfileModal } from '../../Users/ProfileModal.js';

export const Navigation = () => {
  const [ showModal, setShowModal ] = useState(false);

  const handleOpenModal = () => {
    setShowModal(true);
  };

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
      <Nav.Link onClick={handleOpenModal} className="links"><Image url={user} alt="Profile" height="30" /></Nav.Link>
      {showModal &&
        <ProfileModal onClose={handleCloseModal}>
          <h1>Modal Content</h1>
        </ProfileModal>}
    </Navbar>
  );
};
