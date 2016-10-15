import React from 'react';
import { Provider } from 'react-redux';
import {Router, browserHistory} from 'react-router';
import injectTapEventPlugin from 'react-tap-event-plugin';
import routes from './routes';

if (process.env.isClient) {
  // Needed for material-ui
  // See: http://stackoverflow.com/a/34015469/988941
  injectTapEventPlugin();
}

function App({ store }) {
  return (
    <Provider store={store}>
      <Router history={browserHistory} routes={routes} />
    </Provider>
  );
}

export default App;

