import {MANIPULATE_STORY, EDIT_STORY, REMOVE_STORY} from './stories';

const INITIAL_STATE = {
  currentStory: 1,
  storyModal: {
    open: false,
    story: -1
  },
  confirmingRemoveStory: -1,
  importDialogOpen: false
};

const CLOSE_STORY_MODAL = 'app/config/CLOSE_STORY_MODAL';
const SELECT_STORY = 'app/config/SELECT_STORY';
const CONFIRM_REMOVE_STORY = 'app/config/CONFIRM_REMOVE_STORY';
const CLOSE_CONFIRM_REMOVE_STORY_MODAL = 'app/config/CLOSE_CONFIRM_REMOVE_STORY_MODAL';
const OPEN_IMPORT_DIALOG = 'app/config/OPEN_IMPORT_DIALOG';
const CLOSE_IMPORT_DIALOG = 'app/config/CLOSE_IMPORT_DIALOG';

export default function configReducer(state = INITIAL_STATE, action) {
  switch(action.type) {
    case CLOSE_STORY_MODAL:
    case MANIPULATE_STORY: {
      return {
        ...state,
        storyModal: {open: false, story: -1}
      };
    }

    case EDIT_STORY: {
      const id = action.payload;

      return {
        ...state,
        storyModal: {open: true, story: id}
      };
    }

    case SELECT_STORY: {
      const id = action.payload;

      return {
        ...state,
        currentStory: id
      };
    }

    case CONFIRM_REMOVE_STORY: {
      const id = action.payload;

      return {
        ...state,
        confirmingRemoveStory: id
      };
    }

    case REMOVE_STORY:
    case CLOSE_CONFIRM_REMOVE_STORY_MODAL: {
      return {
        ...state,
        confirmingRemoveStory: -1
      };
    }

    case OPEN_IMPORT_DIALOG: {
      return {
        ...state,
        importDialogOpen: true
      };
    }

    case CLOSE_IMPORT_DIALOG: {
      return {
        ...state,
        importDialogOpen: false
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

export function selectStory(id) {
  return {
    type: SELECT_STORY,
    payload: id
  };
}

export function confirmRemoveStory(id) {
  return {
    type: CONFIRM_REMOVE_STORY,
    payload: id
  };
}

export function closeConfirmRemoveStoryModal() {
  return {
    type: CLOSE_CONFIRM_REMOVE_STORY_MODAL
  };
}

export function openImportDialog() {
  return {
    type: OPEN_IMPORT_DIALOG
  };
}

export function closeImportDialog() {
  return {
    type: CLOSE_IMPORT_DIALOG
  };
}

