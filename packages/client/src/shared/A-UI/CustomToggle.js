import React from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';

export const CustomToggle = React.forwardRef(({ onClick }, ref) =>
  <button className="btn-stealth">
    <BsThreeDotsVertical
      className="m-2"
      href="a"
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
      style={{ zIndex: 999 }}
    />
  </button>);
