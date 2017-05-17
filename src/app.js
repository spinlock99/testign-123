import React, { Component } from "react";
import { createStore, applyMiddleware, compose } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import reducer from "./reducer";
import db from "./db";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import AppBar from "material-ui/AppBar";
import { TodoList } from "./components";

export class App extends Component {
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
    return(
      <Provider store={this.configureStore()}>
        <MuiThemeProvider>
          <div>
            <AppBar
              title="Atomic App Store"
              iconClassNameRight={icon}
              onLeftIconButtonTouchTap={this.getData}
              zDepth={1}
            />
            <TodoList />
          </div>
        </MuiThemeProvider>
      </Provider>
    );
  }
}
