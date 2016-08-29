import React from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

import './FloatingButton.css';

export default function FloatingButton({addStory}) {
  return (
    <FloatingActionButton className="FloatingButton" onClick={() => addStory()}>
      <ContentAdd />
    </FloatingActionButton>
  );
}

