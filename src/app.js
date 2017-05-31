import { Routes } from "./routes";
import { BrowserRouter as Router } from "react-router-dom";
import { LeftNav } from "./components/left-nav";
import AppBar from "material-ui/AppBar";
import Paper from "material-ui/Paper";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import reducer from "./data/reducer";
import db from "./data/db";
import thunk from "redux-thunk";
import { Provider } from "react-redux";
import { createStore, applyMiddleware, compose } from "redux";
import React, { Component } from "react";

export class App extends Component {
  constructor(props) {
    super(props);
    this.store = this.configureStore();
  }

  configureStore() {
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    const storeEnhancer =  composeEnhancers(applyMiddleware(thunk));
    const store = createStore(reducer, storeEnhancer);

    if (module.hot) {
      module.hot.accept("./data/reducer", () => {
        const nextRootReducer = require("./data/reducer");
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
        <Router basename={BASENAME}>
          <MuiThemeProvider>
            <Paper>
              <AppBar
                title="Atomic App Creator"
                iconClassNameRight={icon}
                onLeftIconButtonTouchTap={openLeftNav} />
              <LeftNav />
              <Routes />
            </Paper>
          </MuiThemeProvider>
        </Router>
      </Provider>
    );
  }
}
