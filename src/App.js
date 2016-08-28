import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import LeftNav from './components/LeftNav';
import Navbar from './components/Navbar';
import VisibleStories from './containers/VisibleStories';
import CardsInGame from './components/CardsInGame';

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
        </section>
      </MuiThemeProvider>
    );
  }
}

export default App;
