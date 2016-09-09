import {createStore} from 'redux';
import {fromJS} from 'immutable';
import rootReducer from './root-reducer';

const store = createStore(
    rootReducer, fromJS({})
);

export default store;

