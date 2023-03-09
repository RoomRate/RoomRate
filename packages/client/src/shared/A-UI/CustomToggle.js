import React from 'react';
import { BsThreeDots } from 'react-icons/bs';

export const CustomToggle = React.forwardRef(({ onClick }, ref) =>
  <button className="btn-stealth">
    <BsThreeDots
      className="m-2"
      href="a"
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    />
  </button>);
