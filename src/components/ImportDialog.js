import React, {Component} from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import {Tabs, Tab} from 'material-ui/Tabs';
import ImportTrello from './ImportTrello';

import '../styles/ImportDialog.css';

export default class ImportDialog extends Component {
  render() {
    return (
      <Dialog
        actions={this.actions}
        modal={true}
        open={this.props.open}
        bodyClassName="ImportDialog-body"
      >
        <Tabs>
          <Tab label="Trello" >
            <div className="ImportDialog-pad">
              <ImportTrello addStory={this.props.addStory} />
            </div>
          </Tab>
          <Tab label="Redmine" >
            <div>
              TODO
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
        primary={true}
        onTouchTap={this.props.close}
      />
    ];
  }
}

