import {List, fromJS} from 'immutable';

let idGenerator = 0;

const INITIAL_STATE = fromJS([]);

export const MANIPULATE_STORY = 'app/stories/MANIPULATE_STORY';
export const EDIT_STORY = 'app/stories/EDIT_STORY';
export const REMOVE_STORY = 'app/stories/REMOVE_STORY';

export default function storiesReducer(state = INITIAL_STATE, action) {
  switch(action.type) {
    case '@@INIT': {
      return orderStories(state);
    }

    case MANIPULATE_STORY: {
      const {payload} = action;

      const story = payload.id !== -1 ? payload : {
        ...payload,
        average: 0,
        card: [],
        flipped: false,
        id: idGenerator++,
      };

      const storiesBefore = state
        .filter(
          s => s.get('position') < story.position && s.get('id') !== story.id
        );

      const storiesAfter = state
        .filter(
          s => s.get('position') >= story.position && s.get('id') !== story.id
        );

      // eslint-disable-next-line
      return orderStories(List().concat(
        storiesBefore,
        fromJS([story]),
        storiesAfter
      ));
    }

    case REMOVE_STORY: {
      const id = action.payload;

      return orderStories(
        state.filterNot(
          story => story.get('id') === id
        )
      );
    }

    default: {
      return state;
    }
  }
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

export function removeStory(id) {
  return {
    type: REMOVE_STORY,
    payload: id
  };
}

/* Helper */
function orderStories(stories) {
  const sorted = stories.sort((a, b) => a.get('position') - b.get('position'));

  let currentPosition = 1;
  const numbersOk = stories.reduce(
    (acc, story) => story.get('position') === currentPosition++ ? acc : false
  );

  if (numbersOk) {
    return sorted;
  }

  let position = 1;
  return sorted.map(story => story.update('position', pos => position++));
}

