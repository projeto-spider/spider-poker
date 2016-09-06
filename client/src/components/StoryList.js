import React from 'react';
import Story from './Story';

function StoryList({stories, currentStory}) {
  return (
    <div>
      {stories.map((story, key) => (
        <Story {...story} key={key} current={currentStory === story.id}/>
      ))}
    </div>
  );
}

export default StoryList;

