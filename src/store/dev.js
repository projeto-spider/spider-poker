import {createStore, compose} from 'redux';
import {fromJS} from 'immutable';
import rootReducer from './root-reducer';

const enhancers = compose(
  window.devToolsExtension ? window.devToolsExtension() : f => f
);

const store = createStore(
    rootReducer, fromJS({}), enhancers
);

export default store;

