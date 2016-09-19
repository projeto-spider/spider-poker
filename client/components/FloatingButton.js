import React from 'react';
import { css } from 'aphrodite';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import style from '../styles/FloatingButton';

export default function FloatingButton({ addStory }) {
  return (
    <FloatingActionButton className={css(style.main)} onClick={() => addStory()}>
      <ContentAdd />
    </FloatingActionButton>
  );
}

