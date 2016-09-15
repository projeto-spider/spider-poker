import React, { Component } from 'react';
import { fromJS } from 'immutable';
import FlatButton from 'material-ui/FlatButton';
import { List, ListItem } from 'material-ui/List';
import Checkbox from 'material-ui/Checkbox';

export default class ImportList extends Component {
  constructor(props) {
    super(props);

    this.toggleCard = this.toggleCard.bind(this);
    this.importCards = this.importCards.bind(this);
  }

  componentWillMount() {
    this.setState(this.startState);
  }

  get startState() {
    return {
      lists: [],
    };
  }

  componentDidMount() {
    this.setState({ lists: fromJS(this.props.lists) });
  }

  toggleCard(listId, cardId) {
    this.setState({
      lists: this.state.lists
        .updateIn([listId, 'cards', cardId, 'isChecked'], isChecked => !isChecked),
    });
  }

  importCards() {
    this.setState({
      lists: this.state.lists
        .map(list =>
          list.update('cards', cards =>
            cards.filter(card => {
              if (!card.get('isChecked')) {
                return true;
              }

              this.props.addStory(card.get('name'));

              return false;
            })
          )
        ),
    });
  }

  render() {
    return (
      <div>
        Selecione uma lista:
        <List>
          {this.state.lists.map((list, listId) => (
            <ListItem
              key={listId}
              primaryText={list.get('name')}
              initiallyOpen={false}
              primaryTogglesNestedList
              nestedItems={list.get('cards').map((card, cardId) => (
                <ListItem
                  key={cardId}
                  onClick={this.toggleCard.bind(undefined, listId, cardId)}
                  primaryText={card.get('name')}
                  leftIcon={
                    <Checkbox
                      checked={card.get('isChecked')}
                      onCheck={this.toggleCard.bind(undefined, listId, cardId)}
                    />}
                />
              )).toJS()}
            />
          ))}
        </List>

        <FlatButton
          label="Importar"
          style={{ width: '100%' }}
          onTouchTap={this.importCards}
        />
      </div>
    );
  }
}

