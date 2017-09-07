import { Routes } from "./routes";
import { BrowserRouter as Router } from "react-router-dom";
import { LeftNav } from "./components/left-nav";
import AppBar from "material-ui/AppBar";
import Paper from "material-ui/Paper";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import {
  appsReducer,
  leftNavOpenReducer,
  nameReducer,
  redirectReducer,
  tokenReducer,
  socketReducer
} from "./data/reducer";
import db from "./data/db";
import thunk from "redux-thunk";
import { Provider } from "react-redux";
import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import React, { Component } from "react";
import { reducer as formReducer } from "redux-form";
import RaisedButton from "material-ui/RaisedButton";

import openSocket from "socket.io-client";
const socket = openSocket(`${SOCKET}`);

export class App extends Component {
  constructor(props) {
    super(props);
    this.store = this.configureStore();
    this.subscribeToTimer((err, action) => this.store.dispatch(action));
  }

  componentDidMount() {
    db.table("apps").toArray().then(apps =>
      apps.forEach(app =>
        this.store.dispatch({ type: "INSERT_APP", payload: app })));
  }

  configureStore() {
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    const storeEnhancer =  composeEnhancers(applyMiddleware(thunk));
    const reducer = combineReducers({
      apps: appsReducer,
      form: formReducer,
      leftNavOpen: leftNavOpenReducer,
      name: nameReducer,
      redirect: redirectReducer,
      token: tokenReducer,
      socket: socketReducer
    })
    const store = createStore(reducer, storeEnhancer);

    if (module.hot) {
      module.hot.accept("./data/reducer", () => {
        const {
          appsReducer,
          leftNavOpenReducer,
          nameReducer,
          redirectReducer,
          tokenReducer,
          socketReducer
        } = require("./data/reducer");
        const formReducer = require("redux-form").reducer
        const nextReducer = combineReducers({
          apps: appsReducer,
          form: formReducer,
          leftNavOpen: leftNavOpenReducer,
          name: nameReducer,
          redirect: redirectReducer,
          token: tokenReducer,
          socker: sockerReducer
        })
        store.replaceReducer(nextReducer);
      });
    }

    return store;
  }

  subscribeToTimer(callBack) {
    socket.on("timer", timestamp => callBack(null, timestamp));
    socket.emit("subscribeToTimer", 1000);
  }

  render() {
    const icon = "muidocs-icon-navigation-expand-more";
    const action = { type: "TOGGLE_LEFT_NAV", payload: true };
    const openLeftNav = event => this.store.dispatch(action);

    return(
      <Provider store={this.store}>
        <Router basename={BASENAME}>
          <MuiThemeProvider>
            <Paper style={{ height: "98vh" }}>
              <AppBar
                title="Atomic app App Creator"
                iconClassNameRight={icon}
                onLeftIconButtonTouchTap={openLeftNav} />
              <LeftNav />
              <div style={{ minHeight: "100%", position: "relative" }}>
                <Routes dispatch={this.store.dispatch} />
              </div>
            </Paper>
          </MuiThemeProvider>
        </Router>
      </Provider>
    );
  }
}
