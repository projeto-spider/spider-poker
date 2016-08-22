import React from 'react';
import {Card, CardActions, CardHeader} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import Avatar from 'material-ui/Avatar';

import ArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import ArrowForward from 'material-ui/svg-icons/navigation/arrow-forward';
import RotateLeft from 'material-ui/svg-icons/image/rotate-left';
import Cancel from 'material-ui/svg-icons/navigation/cancel';

import {red300, teal500, green500} from 'material-ui/styles/colors';

import './Story.css';

export default function Story() {
  return  (
    <Card className="Story">
      <CardHeader
        avatar={
          <Avatar>
            10
          </Avatar>
        }
        title="A aplicação começa trazendo o último documento com o qual o usuário estava trabalhando. Ou, Como um usuário, eu quero iniciar uma aplicação com a última edição."
        titleStyle={{fontSize: 20, color: '#9E9E9E'}}
      />
      <CardActions>
        <FlatButton label="Anterior" icon={<ArrowBack color={green500} />}/>
        <FlatButton label="Próxima" icon={<ArrowForward color={green500}/>}/>
        <FlatButton label="Virar" icon={<RotateLeft color={teal500}/>}/>
        <FlatButton label="Resetar" icon={<Cancel color={red300}/>}/>
      </CardActions>
    </Card>
  );
}

