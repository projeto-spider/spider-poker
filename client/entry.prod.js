import React from 'react';
import ReactDOM from 'react-dom';
import { StyleSheet } from 'aphrodite';
import App from './App';
import store from './store';

// eslint-disable-next-line
StyleSheet.rehydrate(JSON.parse(window.__RENDERED_CLASS_NAMES__));

ReactDOM.render(
  <App store={store} />,
  document.getElementById('app')
);
