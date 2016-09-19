import React, { Component } from 'react';
import { css } from 'aphrodite';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import { Tabs, Tab } from 'material-ui/Tabs';
import ImportTrello from './ImportTrello';
import ImportRedmine from './ImportRedmine';
import style from '../styles/ImportDialog';

export default class ImportDialog extends Component {
  get actions() {
    return [
      <FlatButton
        label="Fechar"
        primary
        onTouchTap={this.props.close}
      />,
    ];
  }

  render() {
    return (
      <Dialog
        actions={this.actions}
        modal
        open={this.props.open}
        bodyClassName={css(style.body)}
        autoScrollBodyContent
      >
        <Tabs>
          <Tab label="Trello" >
            <div className={css(style.pad)}>
              <ImportTrello addStory={this.props.addStory} />
            </div>
          </Tab>
          <Tab label="Redmine" >
            <div className={css(style.pad)}>
              <ImportRedmine addStory={this.props.addStory} />
            </div>
          </Tab>
        </Tabs>
      </Dialog>
    );
  }
}

