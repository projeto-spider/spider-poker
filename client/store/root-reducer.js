import { combineReducers } from 'redux';
import reduceReducers from 'reduce-reducers';
import {loadingBarReducer as loadingBar} from 'react-redux-loading-bar';

import config from '../reducers/config';
import stories from '../reducers/stories';
import auth from '../reducers/auth';
import flash from '../reducers/flash';

const rootReducer = reduceReducers(
	combineReducers({
		config,
		stories,
		loadingBar,
		flash,
	}),
);

export default rootReducer;

