import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

export default class StoryDialog extends Component {
  constructor(props) {
    super(props);

    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onChangePosition = this.onChangePosition.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount() {
    this.setState(this.emptyModel);
  }

  componentWillReceiveProps({ story }) {
    if (story) {
      const { id, description, position } = story;

      this.setState({
        id: id || -1, description, position,
      });
    } else {
      this.setState(this.emptyModel);
    }
  }

  onChangeDescription(e) {
    this.setState({
      description: e.target.value,
    });
  }

  onChangePosition(e) {
    const value = Number(e.target.value);
    this.setState({
      position: isNaN(value) ? 0 : value,
    });
  }

  onKeyPress(e) {
    if (e.key === 'Enter') {
      this.handleSubmit();
    }
  }

  handleSubmit() {
    this.props.manipulateStory(this.state);
  }

  get emptyModel() {
    return {
      id: -1,
      description: '',
      position: 0,
    };
  }

  get isEditing() {
    return this.state.id > -1;
  }

  get actions() {
    return [
      <FlatButton
        label="Cancelar"
        primary
        onTouchTap={this.props.close}
      />,
      <RaisedButton
        label={this.submitLabel}
        primary
        type="submit"
        onTouchTap={this.handleSubmit}
      />,
    ];
  }

  get dialogTitle() {
    return `${this.isEditing ? 'Editando' : 'Adicionando'} história`;
  }

  get submitLabel() {
    return this.isEditing ? 'Salvar' : 'Adicionar';
  }

  render() {
    return (
      <Dialog
        title={this.dialogTitle}
        actions={this.actions}
        open={this.props.open}
        onRequestClose={this.props.close}
      >
        <div onKeyPress={this.onKeyPress}>
          <TextField
            name="description"
            defaultValue={this.state.description}
            onChange={this.onChangeDescription}
            fullWidth
            floatingLabelText="Descrição"
          />
          <br />
          <TextField
            name="position"
            defaultValue={this.state.position}
            onChange={this.onChangePosition}
            floatingLabelText="Posição"
          />
        </div>
      </Dialog>
    );
  }
}

