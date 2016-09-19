import React from 'react';
import ReactDOM from 'react-dom/server';
import Helmet from 'react-helmet';
import { StyleSheetServer } from 'aphrodite';
import store from '../../client/store';
import App from '../../client/App';

export default function serverSideRender() {
  return new Promise((fulfill) => {
    const { html, css } = StyleSheetServer.renderStatic(() =>
      ReactDOM.renderToString(
        <App store={store} />
      )
    );

    const head = Helmet.rewind();
    const state = store.getState();

    fulfill({ rendered: html, head, state, css });
  });
}
