import React from 'react';
import { Provider } from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import LeftNav from './components/LeftNav';
import NavbarActions from './containers/NavbarActions';
import VisibleStories from './containers/VisibleStories';
import ManipulateStory from './containers/ManipulateStory';
import FloatingActions from './containers/FloatingActions';
import ConfirmRemoveStory from './containers/ConfirmRemoveStory';
import ImportDialogActions from './containers/ImportDialogActions';

if (process.env.isClient) {
  // Needed for material-ui
  // See: http://stackoverflow.com/a/34015469/988941
  injectTapEventPlugin();
}

function App({ store }) {
  return (
    <Provider store={store}>
      <MuiThemeProvider>
        <section>
          <NavbarActions />
          <section className="content">
            <VisibleStories />
          </section>
          <LeftNav />
          <ManipulateStory />
          <FloatingActions />
          <ConfirmRemoveStory />
          <ImportDialogActions />
        </section>
      </MuiThemeProvider>
    </Provider>
  );
}

export default App;

