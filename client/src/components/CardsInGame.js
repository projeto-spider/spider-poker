import React from 'react';
import Card from './Card';

import '../styles/CardsInGame.css';

export default function CardsInGame() {
  return (
    <div className="CardsInGame row">
      <Card username="John Doe" avatar="http://www.material-ui.com/images/ok-128.jpg"/>
      <Card username="Jane Doe" avatar="http://www.material-ui.com/images/uxceo-128.jpg"/>
    </div>
  );
}

