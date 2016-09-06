import React from 'react';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

import '../styles/Navbar.css';

const Navbar = ({openImportDialog}) => (
  <AppBar
    title="Planning Poker"
    className='Navbar'
    iconElementRight={
      <IconMenu
        iconButtonElement={
          <IconButton><MoreVertIcon /></IconButton>
        }
        targetOrigin={{horizontal: 'right', vertical: 'top'}}
        anchorOrigin={{horizontal: 'right', vertical: 'top'}}
      >
        <MenuItem
          primaryText="Importar histórias"
          onTouchTap={() => openImportDialog()}
        />
      </IconMenu>
    }
  />
);

export default Navbar;

