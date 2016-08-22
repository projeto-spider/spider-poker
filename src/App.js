import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import LeftNav from './containers/LeftNav';
import Navbar from './containers/Navbar';
import Story from './containers/Story';
import CardsInGame from './containers/CardsInGame';

class App extends Component {
  render() {
    return (
      <MuiThemeProvider>
        <section>
          <Navbar />
          <section className="content">
            <Story />
            <CardsInGame />
          </section>
          <LeftNav />
        </section>
      </MuiThemeProvider>
    );
  }
}

export default App;
