let idGenerator = 0;

const INITIAL_STATE = [{
  average: 0,
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
  cards: [],
  flipped: false,
  id: idGenerator++,
  position: 2
}, {
  average: 0,
  description: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo',
  cards: [],
  flipped: false,
  id: idGenerator++,
  position: 1
}, {
  average: 0,
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
  cards: [],
  flipped: false,
  id: idGenerator++,
  position: 3
}, {
  average: 0,
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
  cards: [],
  flipped: false,
  id: idGenerator++,
  position: 4
}];

const ADD_STORY = 'app/stories/ADD_STORY';
export const MANIPULATE_STORY = 'app/stories/MANIPULATE_STORY';

export default function storiesReducer(state = INITIAL_STATE, action) {
  switch(action.type) {
    case '@@INIT': {
      return orderStories(state);
    }

    case ADD_STORY: {
      const newStory = {
        ...action.payload,
        average: 0,
        card: [],
        flipped: false,
        id: idGenerator++
      };

      const stories = state.map(story => {
        if (story.position >= newStory.position) {
          story.position++;
        }

        return story;
      });

      stories.push(newStory);

      return orderStories(stories);
    }

    case MANIPULATE_STORY: {
      const story = action.payload;
      const index = state.findIndex(s => s.id === story.id);

      return [
        ...state.slice(0, index),
        story,
        ...state.slice(index + 1)
      ];
    }

    default: {
      return state;
    }
  }
}

export function addStory(story) {
  return {
    type: ADD_STORY,
    payload: story
  };
}

export function manipulateStory(story) {
  return {
    type: MANIPULATE_STORY,
    payload: story
  };
}

/* Helper */
function orderStories(stories) {
  return stories.sort((a, b) => a.position - b.position);
}

