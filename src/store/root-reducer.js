import reduceReducers from 'reduce-reducers';
import {combineReducers} from 'redux';

import {reducer as form} from 'redux-form';
import config from '../reducers/config';
import stories from '../reducers/stories';
import helper from '../reducers/helper';

const rootReducer = reduceReducers(
  combineReducers({config, stories, form}),
  helper
);

export default rootReducer;

