import { createStore, compose, applyMiddleware } from 'redux';
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
	process.env.isClient && window.devToolsExtension ? window.devToolsExtension() : f => f
);

const store = createStore(
    rootReducer, {}, enhancers
);

export default store;

