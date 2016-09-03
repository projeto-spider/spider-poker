import {fromJS} from 'immutable';

const INITIAL_STATE = fromJS({
  dialogs: {
    import: false
  }
});

const OPEN_IMPORT_DIALOG = 'app/config/OPEN_IMPORT_DIALOG';
const CLOSE_IMPORT_DIALOG = 'app/config/CLOSE_IMPORT_DIALOG';

export default function configReducer(state = INITIAL_STATE, action) {
  switch(action.type) {
    case OPEN_IMPORT_DIALOG: {
      return state.setIn(['dialogs', 'import'], true);
    }

    case CLOSE_IMPORT_DIALOG: {
      return state.setIn(['dialogs', 'import'], false);
    }

    default: {
      return state;
    }
  }
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

