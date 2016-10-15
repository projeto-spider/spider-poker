import { createStore, compose } from 'redux';
import { fromJS } from 'immutable';
import rootReducer from './root-reducer';

const enhancers = compose(
  // eslint-disable-next-line
  process.env.isClient && window.devToolsExtension ? window.devToolsExtension() : f => f
);

const store = createStore(
    rootReducer, fromJS({}), enhancers
);

export default store;

