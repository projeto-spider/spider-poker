import React from 'react';
import {Card as MaterialCard, CardHeader, CardText} from 'material-ui/Card';
import './Card.css';

export default function Card({username, avatar}) {
  return (
    <div className="col-xs-6 col-sm-4 col-md-6 col-lg-4">
      <div className="box">
        <MaterialCard>
          <CardHeader
            title={username}
            avatar={avatar}
          />
          <CardText>
              <div className="Card-value">?</div>
          </CardText>
        </MaterialCard>
      </div>
    </div>
  );
}

