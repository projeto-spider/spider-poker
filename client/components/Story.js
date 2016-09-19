import React from 'react';
import { css } from 'aphrodite';
import { Card, CardHeader } from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';
import AvailableStoryActions from '../containers/AvailableStoryActions';
import style from '../styles/Story';

export default function Story({ id, position, current, description }) {
  return (
    <Card className={current ? css(style.story, style.active) : css(style.story)}>
      <CardHeader
        avatar={<Avatar>{position}</Avatar>}
        title={description}
        titleStyle={{ fontSize: 20, color: '#9E9E9E' }}
      />
      <AvailableStoryActions storyId={id} current={current} />
    </Card>
  );
}

