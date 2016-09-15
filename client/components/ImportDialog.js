import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import { Tabs, Tab } from 'material-ui/Tabs';
import ImportTrello from './ImportTrello';
import ImportRedmine from './ImportRedmine';

import '../styles/ImportDialog.css';

export default class ImportDialog extends Component {
  render() {
    return (
      <Dialog
        actions={this.actions}
        modal
        open={this.props.open}
        bodyClassName="ImportDialog-body"
        autoScrollBodyContent
      >
        <Tabs>
          <Tab label="Trello" >
            <div className="ImportDialog-pad">
              <ImportTrello addStory={this.props.addStory} />
            </div>
          </Tab>
          <Tab label="Redmine" >
            <div className="ImportDialog-pad">
              <ImportRedmine addStory={this.props.addStory} />
            </div>
          </Tab>
        </Tabs>
      </Dialog>
    );
  }

  get actions() {
    return [
      <FlatButton
        label="Fechar"
        primary
        onTouchTap={this.props.close}
      />,
    ];
  }
}

