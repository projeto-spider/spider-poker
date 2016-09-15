import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

export default function RemoveStoryDialog({ open, id, removeStory, cancel }) {
  const actions = [
    <FlatButton
      label="Cancelar"
      primary
      onTouchTap={() => cancel()}
    />,
    <FlatButton
      label="Remover"
      primary
      onTouchTap={() => removeStory(id)}
    />,
  ];

  return (
    <Dialog
      actions={actions}
      modal={false}
      open={open}
      onRequestClose={() => cancel()}
    >
      Remover história?
    </Dialog>
  );
}

