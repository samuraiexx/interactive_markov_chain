import React from 'react';
import { hot } from 'react-hot-loader';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link as RouterLink,
} from "react-router-dom";
import { Link } from '@material-ui/core';
import { createMuiTheme, ThemeProvider } from "@material-ui/core"
import CssBaseline from '@material-ui/core/CssBaseline';

import './App.css';
import Home from './home';
import About from './about';

const darkTheme = createMuiTheme({
  palette: {
    type: 'dark',
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline>
        <Router>
          <div className="pageContainer">
            <div>
              <Link component={RouterLink} to="/">Home</Link>
              <Link component={RouterLink} to="/about">About</Link>
            </div>
            <Switch>
              <Route path="/about">
                <About />
              </Route>
              <Route path="/">
                <Home />
              </Route>
            </Switch>
          </div>
        </Router>
      </CssBaseline>
    </ThemeProvider >
  );

}

export default hot(module)(App);
