import React, {Component} from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

export default class StoryDialog extends Component {
  constructor(props) {
    super(props);

    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onChangePosition = this.onChangePosition.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount() {
    const story = this.props.story || {
      id: -1,
      description: '',
      position: -1
    };

    this.setState(story);
  }

  onChangeDescription(e) {
    this.setState({
      description: e.target.value
    });
  }

  onChangePosition(e) {
    const value = Number(e.target.value);
    this.setState({
      position: isNaN(value) ? 0 : value
    });
  }

  handleSubmit() {
    this.props.manipulateStory(this.state);
  }

  render() {
    return (
      <Dialog
        title={this.dialogTitle}
        actions={this.actions}
        modal={false}
        open={this.props.open}
        onRequestClose={this.props.close}
      >
        <form onSubmit={() => false} method="GET">
          <TextField name="description" hintText="Descrição" value={this.state.description} onChange={this.onChangeDescription} />
          <br />
          <TextField name="position" hintText="Posição (padrão = 0)" value={this.state.position} onChange={this.onChangePosition} />
        </form>
      </Dialog>
    );
  }

  get isEditing() {
    return this.state.id > -1;
  }

  get actions() {
    return [
      <FlatButton
        label="Cancelar"
        primary={true}
        onTouchTap={this.props.close}
      />,
      <RaisedButton
        label={this.submitLabel}
        primary={true}
        type="submit"
        onTouchTap={this.handleSubmit}
      />
    ];
  }

  get dialogTitle() {
    return `${this.isEditing ? 'Editando' : 'Adicionando'} história`;
  }

  get submitLabel() {
    return this.isEditing ? 'Salvar' : 'Adicionar';
  }
}

