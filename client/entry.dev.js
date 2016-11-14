import React from 'react';
import ReactDOM from 'react-dom';
import { StyleSheet } from 'aphrodite';
import App from './App';
import store from './store';
import * as foo from './lib';

window.api = foo.api;

ReactDOM.render(
  <App store={store} />,
  document.getElementById('app')
);

