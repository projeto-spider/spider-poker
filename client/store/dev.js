import { createStore, compose } from 'redux';
import { fromJS } from 'immutable';
import transit from 'transit-immutable-js';
import rootReducer from './root-reducer';

const enhancers = compose(
  // eslint-disable-next-line
  process.env.isClient && window.devToolsExtension ? window.devToolsExtension() : f => f
);

const store = createStore(
    rootReducer, loadState(), enhancers
);

// Thanks to chaintan17
// See: https://github.com/mxstbr/react-boilerplate/issues/396
store.subscribe(() => {
  try {
    const state = store.getState();
    const serializedState = transit.toJSON(state);
    // eslint-disable-next-line
    localStorage.setItem('state', serializedState);
  } catch (err) {
    console.log('Could not save current redux state', err);
  }
});

export default store;

function loadState() {
  try {
    const serializedState = localStorage.getItem('state');

    if (serializedState === null) {
      return fromJS({});
    }

    return transit.fromJSON(serializedState);
  } catch (err) {
    return fromJS({});
  }
}

