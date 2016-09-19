import React from 'react';
import { css } from 'aphrodite';
import Card from './Card';
import style from '../styles/CardsInGame';

export default function CardsInGame() {
  return (
    <div className="row" className={css(style.main)}>
      <Card username="John Doe" avatar="http://www.material-ui.com/images/ok-128.jpg" />
      <Card username="Jane Doe" avatar="http://www.material-ui.com/images/uxceo-128.jpg" />
    </div>
  );
}

