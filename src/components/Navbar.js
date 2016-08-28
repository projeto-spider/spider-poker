import React from 'react';
import AppBar from 'material-ui/AppBar';

import './Navbar.css';

const Navbar = () => (
  <AppBar
    title="Planning Poker"
    iconClassNameRight="muidocs-icon-navigation-expand-more"
    className='Navbar'
  />
);

export default Navbar;

