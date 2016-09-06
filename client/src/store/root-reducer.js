import {combineReducers} from 'redux-immutable';
import reduceReducers from 'reduce-reducers';

import config from '../reducers/config';
import stories from '../reducers/stories';

const rootReducer = reduceReducers(
  combineReducers({config, stories}),
);

export default rootReducer;

