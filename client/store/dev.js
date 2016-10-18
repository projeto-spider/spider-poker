import { createStore, compose, applyMiddleware } from 'redux';
import promiseMiddleware from 'redux-promise-middleware';
import rootReducer from './root-reducer';

const enhancers = compose(
	applyMiddleware(
		promiseMiddleware(),
	),
  process.env.isClient && window.devToolsExtension ? window.devToolsExtension() : f => f
);

const store = createStore(
	rootReducer, {}, enhancers
);

export default store;

