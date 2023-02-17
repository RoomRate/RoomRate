import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter } from 'react-router-dom';

export const Providers = ({ children }) =>
  <BrowserRouter>
    {children}
  </BrowserRouter>;

Providers.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element, PropTypes.arrayOf(PropTypes.element),
  ]),
};
