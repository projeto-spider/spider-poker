import React, {Component} from 'react';
import FlatButton from 'material-ui/FlatButton';
import {List, ListItem} from 'material-ui/List';

const trello = window.Trello;

export default class ImportTrello extends Component {
  constructor(props) {
    super(props);

    this.authorize = this.authorize.bind(this);
    this.loadBoards = this.loadBoards.bind(this);
    this.selectBoard = this.selectBoard.bind(this);
    this.loadLists = this.loadLists.bind(this);
    this.importCards = this.importCards.bind(this);
  }

  componentWillMount() {
    this.setState(this.startState);
  }

  get startState() {
    return {
      authorized: false,
      boards: [],
      lists: [],
      boardId: false
    };
  }

  authorize() {
    trello.authorize({
      type: 'popup',
      name: 'Planning Poker',
      scope: {
        read: 'true'
      },
      expiration: 'never',
      success: () => {
        this.setState({authorized: true});
        this.loadBoards();
      },
      error: () => {
        this.setState({authorized: false});
      }
     });
  }

  loadBoards() {
    trello.get('/members/me/boards', data => {
      this.setState({boards: data});
    }, error => console.log(error));
  }

  loadLists(boardId) {
    trello.get(`/boards/${boardId}/lists`, {cards: 'all'}, lists => {
      this.setState({lists});
    }, error => console.log(error));
  }

  selectBoard(boardId) {
    this.setState({boardId});
    this.loadLists(boardId);
  }

  importCards(listKey) {
    const list = this.state.lists[listKey];

    list.cards.forEach(card => this.props.addStory(card.name));

    this.setState({
      lists: this.state.lists.filter((_v, key) => key !== listKey)
    });
  }

  render() {
    if (!this.state.authorized) {
      return this.nonAuthorizedView;
    }

    if (this.state.boardId) {
      return this.selectListView;
    }

    return this.selectBoardView;
  }

  get nonAuthorizedView() {
    return (
      <FlatButton
        label="Autorizar aplicação"
        onTouchTap={this.authorize}
      />
    );
  }

  get selectBoardView() {
    return (
      <div>
        Selecione um quadro:
        <List>
          {this.state.boards.map((board, key) => (
            <ListItem
              primaryText={board.name}
              onTouchTap={() => this.selectBoard(board.id)}
              key={key}
            />
          ))}
        </List>
      </div>
    );
  }

  get selectListView() {
    return (
      <div>
        Selecione uma lista:
        <List>
          {this.state.lists.map((list, key) => (
            <ListItem
              primaryText={list.name}
              onTouchTap={() => this.importCards(key)}
              key={key}
            />
          ))}
        </List>
      </div>
    );
  }
}

