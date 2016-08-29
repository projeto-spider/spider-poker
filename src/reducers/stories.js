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
export const EDIT_STORY = 'app/stories/EDIT_STORY';

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

      const storiesBefore = state
        .filter(
          s => s.position <= story.position && s.id != story.id
        );

      const storiesAfter = state
        .filter(
          s => s.position > story.position && s.id != story.id
        )
        .map(s => ({
          ...s,
          position: s.position + 1}
        ));

      return orderStories([
        ...storiesBefore,
        story,
        ...storiesAfter
      ]);
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

export function editStory(id) {
  return {
    type: EDIT_STORY,
    payload: id
  };
}

/* Helper */
function orderStories(stories) {
  const sorted = stories.sort((a, b) => a.position - b.position);

  let currentPosition = 1;
  const numbersOk = stories.reduce(
    (acc, story) => story.position === currentPosition++ ? acc : false
  );

  if (numbersOk) {
    return sorted;
  }

  let position = 1;
  return sorted.map(story => ({
    ...story,
    position: position++
  }));
}

