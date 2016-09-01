import {combineReducers} from 'redux-immutable';

import config from '../reducers/config';
import stories from '../reducers/stories';

const rootReducer = combineReducers({
  config, stories
});

export default rootReducer;

