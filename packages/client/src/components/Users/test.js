import React, { useState } from 'react';
import ProfileModal from './ProfileModal';

export const Test = () => {
  const [ showModal, setShowModal ] = useState(false);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };
  console.log(`Parent rendered`);

  return (
    <>
      <h1>Parent Component</h1>
      <div>
        <button onClick={handleOpenModal}>Open Modal</button>
        {showModal &&
          <ProfileModal onClose={handleCloseModal}>
            <h1>Modal Content</h1>
          </ProfileModal>}
      </div>
    </>
  );
};
