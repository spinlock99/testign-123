import React, { Component } from "react";
import { render } from "react-dom";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { TodoList } from "./src/components";
import reducer from "./src/reducer";

class App extends Component {
  configureStore() {
    const store = createStore(reducer);
    if (module.hot) {
      module.hot.accept("./src/reducer", () => {
        const nextRootReducer = require("./src/reducer");
        store.replaceReducer(nextRootReducer);
      });
    }
    return store;
  }
  render() {
    return <Provider store={this.configureStore()}><TodoList /></Provider>;
  }
}

const containerEl = document.getElementById("container");
render(<App />, containerEl);
