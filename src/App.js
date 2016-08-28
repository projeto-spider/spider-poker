import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import LeftNav from './components/LeftNav';
import Navbar from './components/Navbar';
import VisibleStories from './containers/VisibleStories';
import CardsInGame from './components/CardsInGame';
import ManipulateStory from './containers/ManipulateStory';

class App extends Component {
  render() {
    return (
      <MuiThemeProvider>
        <section>
          <Navbar />
          <section className="content">
            <VisibleStories />
            <CardsInGame />
          </section>
          <LeftNav />
        <ManipulateStory />
        </section>
      </MuiThemeProvider>
    );
  }
}

export default App;
