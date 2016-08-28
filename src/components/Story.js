import React from 'react';
import {Card, CardHeader} from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';
import AvailableStoryActions from '../containers/AvailableStoryActions';

import './Story.css';

export default function Story({id, position, current, description}) {
  return (
    <Card className={current ? 'Story Story-active' : 'Story'}>
      <CardHeader
        avatar={<Avatar>{position}</Avatar>}
        title={description}
        titleStyle={{fontSize: 20, color: '#9E9E9E'}}
      />
      <AvailableStoryActions storyId={id} current={current}/>
    </Card>
  );
}

