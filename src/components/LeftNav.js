import React from 'react';
import Drawer from 'material-ui/Drawer';
import Avatar from 'material-ui/Avatar';
import Subheader from 'material-ui/Subheader';
import {List, ListItem} from 'material-ui/List';
import {green500, grey500} from 'material-ui/styles/colors';

import Done from 'material-ui/svg-icons/action/done';
import Restore from 'material-ui/svg-icons/action/restore';

import './LeftNav.css';

export default function LeftNav() {
  const docked =  window.innerWidth >= 980;
  const style = docked ? {marginTop: '65px'} : {marginTop: '0'};

  return (
    <Drawer containerClassName="LeftNav" docked={docked} open={false} containerStyle={style}>
      <List>
        <Subheader>Usuários</Subheader>
        <ListItem
          primaryText="John Doe"
          leftAvatar={<Avatar src="http://www.material-ui.com/images/ok-128.jpg" />}
          rightIcon={<Done color={green500}/>}
        />
        <ListItem
          primaryText="Josh Doe"
          leftAvatar={<Avatar src="http://www.material-ui.com/images/kolage-128.jpg" />}
          rightIcon={<Restore color={grey500}/>}
        />
        <ListItem
          primaryText="Jane Doe"
          leftAvatar={<Avatar src="http://www.material-ui.com/images/uxceo-128.jpg" />}
          rightIcon={<Done color={green500}/>}
        />
        <ListItem
          primaryText="Charles Doe"
          leftAvatar={<Avatar src="http://www.material-ui.com/images/kerem-128.jpg" />}
          rightIcon={<Restore color={grey500}/>}
        />
        <ListItem
          primaryText="Raquel Doe"
          leftAvatar={<Avatar src="http://www.material-ui.com/images/raquelromanp-128.jpg" />}
          rightIcon={<Restore color={grey500}/>}
        />
      </List>
    </Drawer>
  );
}

