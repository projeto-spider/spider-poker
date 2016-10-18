import { createStore } from 'redux';
import { fromJS } from 'immutable';
import promiseMiddleware from 'redux-promise-middleware';
import rootReducer from './root-reducer';

const enhancers = compose(
	applyMiddleware(
		promiseMiddleware(),
	),
);

const store = createStore(
    rootReducer, fromJS({}), enhancers
);

export default store;

