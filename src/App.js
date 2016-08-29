import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import LeftNav from './components/LeftNav';
import Navbar from './components/Navbar';
import VisibleStories from './containers/VisibleStories';
import ManipulateStory from './containers/ManipulateStory';
import FloatingActions from './containers/FloatingActions';
import ConfirmRemoveStory from './containers/ConfirmRemoveStory';

class App extends Component {
  render() {
    return (
      <MuiThemeProvider>
        <section>
          <Navbar />
          <section className="content">
            <VisibleStories />
          </section>
          <LeftNav />
        <ManipulateStory />
        <FloatingActions />
        <ConfirmRemoveStory />
        </section>
      </MuiThemeProvider>
    );
  }
}

export default App;
