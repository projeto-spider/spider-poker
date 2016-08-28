import {MANIPULATE_STORY} from './stories';

const INITIAL_STATE = {
  currentStory: 1,
  storyModal: {
    open: true,
    story: 0
  }
};

const CLOSE_STORY_MODAL = 'app/config/CLOSE_STORY_MODAL';

export default function configReducer(state = INITIAL_STATE, action) {
  switch(action.type) {
    case CLOSE_STORY_MODAL:
    case MANIPULATE_STORY: {
      return {
        ...state,
        storyModal: {open: false, story: -1}
      };
    }

    default: {
      return state;
    }
  }
}

export function closeStoryModal() {
  return {
    type: CLOSE_STORY_MODAL,
  };
}

