import { createStore } from 'redux';
import promiseMiddleware from 'redux-promise-middleware';
import {loadingBarMiddleware} from 'react-redux-loading-bar';
import rootReducer from './root-reducer';

const enhancers = compose(
	applyMiddleware(
		promiseMiddleware(),
		loadingBarMiddleware({
			promiseTypeSuffixes: ['PENDING', 'FULFILLED', 'REJECTED'],
		}),
	),
);

const store = createStore(
    rootReducer, {}, enhancers
);

export default store;

