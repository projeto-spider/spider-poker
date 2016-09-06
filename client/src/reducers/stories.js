import {fromJS} from 'immutable';

const INITIAL_STATE = fromJS({
  current: -1,
  dialogs: {
    manipulate: {open: false, story: -1},
    remove: -1
  },
  list: []
});

const MANIPULATE_STORY = 'app/stories/MANIPULATE_STORY';
const EDIT_STORY = 'app/stories/EDIT_STORY';
const REMOVE_STORY = 'app/stories/REMOVE_STORY';
const CLOSE_STORY_MODAL = 'app/stories/CLOSE_STORY_MODAL';
const CLOSE_REMOVE_MODAL = 'app/stories/CLOSE_REMOVE_MODAL';
const SELECT_STORY = 'app/stories/SELECT_STORY';
const CONFIRM_REMOVE_STORY = 'app/stories/CONFIRM_REMOVE_STORY';

export default function storiesReducer(state = INITIAL_STATE, action) {
  switch(action.type) {
    case '@@INIT': {
      return state.update('list', list => order(list));
    }

    case MANIPULATE_STORY: {
      const {payload} = action;

      const isUpdating = payload.id !== -1;
      const newState = state
        .setIn(['dialogs', 'manipulate'], fromJS({
          open: false,
          story: -1
        }));

      if (isUpdating) {
        return newState
          .update('list', list => updateStory(list, payload));
      }

      return newState
        .update('list', list => addStory(list, {
          ...payload,
          average: 0,
          card: [],
          flipped: false,
          id: Date.now(),
        }));
    }

    case CLOSE_STORY_MODAL: {
      return state
        .setIn(['dialogs', 'manipulate'], fromJS({
          open: false,
          story: -1
        }));
    }

    case CONFIRM_REMOVE_STORY: {
      const id = action.payload;

      return state.setIn(['dialogs', 'remove'], id);
    }

    case REMOVE_STORY: {
      const id = action.payload;

      return state
        .setIn(['dialogs', 'remove'], -1)
        .update('list', list => order(
          list.filterNot(story => story.get('id') === id)
        ));
    }

    case CLOSE_REMOVE_MODAL: {
      return state
        .setIn(['dialogs', 'remove'], -1);
    }

    case EDIT_STORY: {
      const id = action.payload;

      return state
        .setIn(['dialogs', 'manipulate'], fromJS({
          open: true,
          story: id
        }));
    }

    case SELECT_STORY: {
      const id = action.payload;

      return state.set('current', id);
    }

    default: {
      return state;
    }
  }
}

export function manipulate(story) {
  return {
    type: MANIPULATE_STORY,
    payload: story
  };
}

export function edit(id) {
  return {
    type: EDIT_STORY,
    payload: id
  };
}

export function remove(id) {
  return {
    type: REMOVE_STORY,
    payload: id
  };
}

export function select(id) {
  return {
    type: SELECT_STORY,
    payload: id
  };
}

export function confirmRemove(id) {
  return {
    type: CONFIRM_REMOVE_STORY,
    payload: id
  };
}

export function closeStoryModal() {
  return {
    type: CLOSE_STORY_MODAL
  };
}

export function closeRemoveModal() {
  return {
    type: CLOSE_REMOVE_MODAL
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

