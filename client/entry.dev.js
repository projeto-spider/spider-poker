import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { StyleSheet } from 'aphrodite';
import App from './App';
import store from './store';

// eslint-disable-next-line
StyleSheet.rehydrate(JSON.parse(window.__RENDERED_CLASS_NAMES__));

ReactDOM.render(
  <AppContainer>
    <App store={store} />
  </AppContainer>,
  document.getElementById('app')
);

if (module.hot) {
  module.hot.accept('./App', () => {
    const NextApp = require('./App').default; // eslint-disable-line
    ReactDOM.render(
      <AppContainer>
        <NextApp store={store} />
      </AppContainer>,
      document.getElementById('app')
    );
  });
}
