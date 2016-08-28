import reduceReducers from 'reduce-reducers';
import {combineReducers} from 'redux';

import config from '../reducers/config';
import stories from '../reducers/stories';

const rootReducer = reduceReducers(
  combineReducers({config, stories})
);

export default rootReducer;

