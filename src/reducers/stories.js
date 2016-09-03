import {List, fromJS} from 'immutable';

let idGenerator = 0;

const INITIAL_STATE = fromJS([]);

export const MANIPULATE_STORY = 'app/stories/MANIPULATE_STORY';
export const EDIT_STORY = 'app/stories/EDIT_STORY';
export const REMOVE_STORY = 'app/stories/REMOVE_STORY';

export default function storiesReducer(state = INITIAL_STATE, action) {
  switch(action.type) {
    case '@@INIT': {
      return order(state);
    }

    case MANIPULATE_STORY: {
      const {payload} = action;

      const isUpdating = payload.id !== -1;

      if (isUpdating) {
        return updateStory(state, payload);
      }

      return addStory(state, {
        ...payload,
        average: 0,
        card: [],
        flipped: false,
        id: Date.now(),
      });
    }

    case REMOVE_STORY: {
      const id = action.payload;

      return order(
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
function addStory(stories, newStory) {
  return order(stories
    .map(story => {
      if (story.get('id') !== newStory.id && story.get('position') >= newStory.position) {
        return story.update('position', position => position + 1);
      }

      return story;
    })
    .insert(newStory.position < 0 ? 0 : newStory.position - 1, fromJS(newStory)));
}

function updateStory(stories, toUpdate) {
  return order(stories
    .map(story => {
      if (story.get('id') === toUpdate.id) {
        return story.merge(fromJS(toUpdate));
      }

      return story;
    }));
}

function order(stories) {
  let position = 1;
  return stories
    .sortBy(sorter)
    .map(story => story.update('position', () => position++));
}

function sorter(story) {
  return story.position;
}

