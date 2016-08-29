import React from 'react';
import {CardActions} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import RotateLeft from 'material-ui/svg-icons/image/rotate-left';
import Cancel from 'material-ui/svg-icons/navigation/cancel';
import RadioButtonUnchecked from 'material-ui/svg-icons/toggle/radio-button-unchecked';
import ModeEdit from 'material-ui/svg-icons/editor/mode-edit';
import {red300, teal500, blueGrey500} from 'material-ui/styles/colors';

export default function VisibleStories({storyId, current, editStory}) {
  const commonActions = (
    <FlatButton
      label="Editar"
      icon={<ModeEdit color={blueGrey500} />}
      onTouchTap={() => editStory(storyId)}
    />
  );

  if (current) {
    return (
      <CardActions>
        <FlatButton label="Virar" icon={<RotateLeft color={teal500}/>}/>
        <FlatButton label="Resetar" icon={<Cancel color={red300}/>}/>
        {commonActions}
      </CardActions>
    );
  }

  return (
    <CardActions>
      <FlatButton label="Selecionar" icon={<RadioButtonUnchecked />}/>
      {commonActions}
    </CardActions>
  );
}

