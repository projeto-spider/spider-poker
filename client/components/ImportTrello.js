import React, { Component } from 'react';
import FlatButton from 'material-ui/FlatButton';
import { List, ListItem } from 'material-ui/List';
import CircularProgress from 'material-ui/CircularProgress';
import Beenhere from 'material-ui/svg-icons/maps/beenhere';
import ImportList from './ImportList';

const trello = process.env.isClient ? window.Trello : {};

export default class ImportTrello extends Component {
  constructor(props) {
    super(props);

    this.authorize = this.authorize.bind(this);
    this.loadBoards = this.loadBoards.bind(this);
    this.selectBoard = this.selectBoard.bind(this);
    this.loadLists = this.loadLists.bind(this);
  }

  componentWillMount() {
    this.setState(this.startState);
  }

  get startState() {
    return {
      loading: false,
      authorized: false,
      boards: [],
      lists: [],
      boardId: false,
    };
  }

  authorize() {
    this.setState({ loading: true });

    trello.authorize({
      type: 'popup',
      name: 'Planning Poker',
      scope: {
        read: 'true',
      },
      expiration: 'never',
      success: () => {
        this.setState({ authorized: true, loading: false });
        this.loadBoards();
      },
      error: () => {
        this.setState({ authorized: false });
      },
    });
  }

  loadBoards() {
    this.setState({ loading: true });

    trello.get('/members/me/boards', boards => {
      this.setState({ boards, loading: false });
    }, error => console.log(error));
  }

  loadLists(boardId) {
    this.setState({ loading: true });

    trello.get(`/boards/${boardId}/lists`, { cards: 'all' }, lists => {
      this.setState({
        lists: lists.map(list => ({
          name: list.name,
          cards: list.cards.map(card => ({
            name: card.name,
            isChecked: true,
          })),
        })),
        loading: false,
      });
    }, error => console.log(error));
  }

  selectBoard(boardId) {
    this.setState({ boardId });
    this.loadLists(boardId);
  }

  render() {
    if (this.state.loading) {
      return this.loadingView;
    }

    if (!this.state.authorized) {
      return this.nonAuthorizedView;
    }

    if (this.state.boardId) {
      return this.selectListView;
    }

    return this.selectBoardView;
  }

  get loadingView() {
    const style = {
      textAlign: 'center',
    };

    return (
      <div style={style}>
        <CircularProgress innerStyle={style} />
      </div>
    );
  }

  get nonAuthorizedView() {
    const style = {
      width: '100%',
    };

    return (
      <FlatButton
        label="Autorizar aplicação"
        onTouchTap={this.authorize}
        icon={<Beenhere />}
        style={style}
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
      <ImportList
        lists={this.state.lists}
        addStory={this.props.addStory}
      />
    );
  }
}

