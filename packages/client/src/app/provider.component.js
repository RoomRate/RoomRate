import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter } from 'react-router-dom';

export const Providers = ({ children }) =>
  <React.StrictMode>
    <BrowserRouter>
        {children}
    </BrowserRouter>
  </React.StrictMode>;
  
Providers.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element, PropTypes.arrayOf(PropTypes.element),
  ]),
};
