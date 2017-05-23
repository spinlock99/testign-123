import React, { Component } from "react";
import { createStore, applyMiddleware, compose } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import reducer from "./reducer";
import db from "./db";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import AppBar from "material-ui/AppBar";
import Paper from "material-ui/Paper";
import { AppForm } from "./components/app-form";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { LeftNav } from "./components/left-nav";

const About = () => (
  <div>
    <h2>About</h2>
  </div>
)

export class App extends Component {
  constructor(props) {
    super(props);
    this.store = this.configureStore();
  }

  configureStore() {
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    const store = createStore(reducer, composeEnhancers(applyMiddleware(thunk)));

    if (module.hot) {
      module.hot.accept("./reducer", () => {
        const nextRootReducer = require("./reducer");
        store.replaceReducer(nextRootReducer);
      });
    }

    return store;
  }

  render() {
    const icon = "muidocs-icon-navigation-expand-more";
    const action = { type: "TOGGLE_LEFT_NAV", payload: true };
    const openLeftNav = event => this.store.dispatch(action);

    return(
      <Provider store={this.store}>
        <Router>
          <MuiThemeProvider>
            <Paper>
              <AppBar
                title="Atomic App Creator"
                iconClassNameRight={icon}
                onLeftIconButtonTouchTap={openLeftNav}
              />
              <LeftNav />
              <Route exact path="/" component={AppForm} />
              <Route path="/about" component={About} />
            </Paper>
          </MuiThemeProvider>
        </Router>
      </Provider>
    );
  }
}
