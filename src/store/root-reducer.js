import reduceReducers from 'reduce-reducers';
import {combineReducers} from 'redux';

import config from '../reducers/config';

const rootReducer = reduceReducers(
  combineReducers({config})
);

export default rootReducer;

