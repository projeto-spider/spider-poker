import {createStore, compose} from 'redux';
import rootReducer from './root-reducer';

const enhancers = compose(
  window.devToolsExtension ? window.devToolsExtension() : f => f
);

const store = createStore(
    rootReducer, {}, enhancers
);

export default store;

