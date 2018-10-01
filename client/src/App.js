import React, { Component } from 'react';
import WebTorrent from './components/WebTorrent';
import Container from './components/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import 'typeface-roboto';

const magnetLink =
  'magnet:?xt=urn:btih:78213e3bb59041eb4cad232924eb8797a2b47592&dn=1.+Introducing+Advanced+GraphQL.mp4&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com';

class App extends Component {
  render() {
    return (
      <CssBaseline>
        <div className="App">
          <Container>
            <WebTorrent />
          </Container>
        </div>
      </CssBaseline>
    );
  }
}

export default App;
