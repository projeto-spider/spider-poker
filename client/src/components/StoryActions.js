import React from 'react';
import {CardActions} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import Cancel from 'material-ui/svg-icons/navigation/cancel';
import RadioButtonUnchecked from 'material-ui/svg-icons/toggle/radio-button-unchecked';
import ModeEdit from 'material-ui/svg-icons/editor/mode-edit';
import {red300, blueGrey500} from 'material-ui/styles/colors';

export default function VisibleStories({storyId, current, editStory, selectStory, confirmRemoveStory}) {
  const commonActions = (
    <span>
      <FlatButton
        label="Editar"
        icon={<ModeEdit color={blueGrey500} />}
        onTouchTap={() => editStory(storyId)}
      />
      <FlatButton
        label="Remover"
        icon={<Cancel color={red300}/>}
        onTouchTap={() => confirmRemoveStory(storyId)}
      />
    </span>
  );

  if (current) {
    return (
      <CardActions>
        {commonActions}
      </CardActions>
    );
  }

  return (
    <CardActions>
      <FlatButton
        label="Selecionar"
        icon={<RadioButtonUnchecked />}
        onTouchTap={() => selectStory(storyId)}
      />
      {commonActions}
    </CardActions>
  );
}

