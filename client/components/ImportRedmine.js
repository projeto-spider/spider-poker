import React, { Component } from 'react';
import FlatButton from 'material-ui/FlatButton';
import CircularProgress from 'material-ui/CircularProgress';
import TextField from 'material-ui/TextField';
import ImportList from './ImportList';

export default class ImportRedmine extends Component {
  constructor(props) {
    super(props);

    this.loadProjects = this.loadProjects.bind(this);
    this.onChangeInput = this.onChangeInput.bind(this);
  }

  componentWillMount() {
    this.setState(this.startState);
  }

  onChangeInput(field) {
    return e => {
      this.setState({ [field]: e.target.value });
    };
  }

  // eslint-disable-next-line
  get startState() {
    return {
      loading: false,
      project: 'projeto-spider',
      hostname: 'http://hostedredmine.com',
      username: '',
      password: '',
      apiKey: '4fb1195713014d85ac8c76b18bcf58cffbc838b5',
      issues: false,
    };
  }

  loadProjects() {
    this.setState({ loading: true });

    const { hostname = '', project = '', apiKey = '', username, password } = this.state;

    const queryString =
      `hostname=${hostname}&project=${project}&key=${apiKey}`;

    const headers = {};
    if (username !== '' && password !== '') {
      headers.Authorization =
        `Basic ${new Buffer(`${username}:${password}`).toString('base64')}`;
    }

    // eslint-disable-next-line
		fetch(`/widgets/redmine/issues?${queryString}`, {
      headers,
    })
      .then(r => r.json())
      .then(({ issues = [] }) => {
        const typed = {};

        issues.forEach(issue => {
          const type = issue.tracker.name;
          const value = issue.subject;

          if (!typed[type]) {
            typed[type] = [];
          }

          typed[type].push({ name: value, isChecked: true });
        });

        const listed = [];

        for (const type of Object.keys(typed)) {
          listed.push({
            name: type,
            cards: typed[type],
          });
        }

        this.setState({
          issues: listed,
          loading: false,
        });
      })
      .catch(console.error);
  }

  // eslint-disable-next-line
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

  get selectProjectView() {
    const headerStyles = {
      margin: '12px 0 0',
    };
    const fullwidthInput = {
      width: '100%',
    };
    const loginInputStyles = {
      width: '50%',
    };

    const formFilled =
      this.state.hostname !== '' && this.state.project !== '' &&
      (
        (this.state.username !== '' && this.state.password !== '')
        || this.state.apiKey !== ''
      );

    return (
      <div>
        <h4 style={headerStyles}>Projeto</h4>
        <TextField
          floatingLabelText="Dominio"
          floatingLabelFixed
          hintText="dominio.com"
          style={fullwidthInput}
          value={this.state.hostname}
          onChange={this.onChangeInput('hostname')}
        />

        <TextField
          floatingLabelText="Identificador"
          floatingLabelFixed
          hintText="dominio.com/projects/{seu_identificador}"
          style={fullwidthInput}
          value={this.state.project}
          onChange={this.onChangeInput('project')}
        />

        <h4 style={headerStyles}>Acessar usando login</h4>
        <TextField
          floatingLabelText="Nome de usuário"
          style={loginInputStyles}
          disabled={this.state.apiKey !== ''}
          value={this.state.username}
          onChange={this.onChangeInput('username')}
        />
        <TextField
          floatingLabelText="Senha"
          style={loginInputStyles}
          type="password"
          disabled={this.state.apiKey !== ''}
          value={this.state.password}
          onChange={this.onChangeInput('password')}
        />

        <h4 style={headerStyles}>Ou acessar usando um API Key</h4>
        <TextField
          floatingLabelText="API Key"
          style={fullwidthInput}
          disabled={this.state.username !== '' || this.state.password !== ''}
          value={this.state.apiKey}
          onChange={this.onChangeInput('apiKey')}
        />

        <br />

        <FlatButton
          label="Carregar tarefas"
          onTouchTap={this.loadProjects}
          disabled={!formFilled}
        />
      </div>
    );
  }

  get selectListView() {
    return (
      <ImportList
        lists={this.state.issues || []}
        addStory={this.props.addStory}
      />
    );
  }

  render() {
    if (this.state.loading) {
      return this.loadingView;
    }

    if (!Array.isArray(this.state.issues)) {
      return this.selectProjectView;
    }

    return this.selectListView;
  }
}

