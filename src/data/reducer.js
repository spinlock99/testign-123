import { List, Map } from "immutable";

const initialState = {
  name: "",
  apps: {}
};

export default function(state=initialState, action) {
  const app = action.payload;
  let nextState = JSON.parse(JSON.stringify(state));

  switch(action.type) {
    //
    // action.payload is an app
    //
    case "CREATE_APP":
      nextState.apps[app.id] = { id: app.id, name: app.name };
      nextState.name = "";
      return nextState;
    case "INSERT_APP":
      nextState.apps[app.id] = app;
      return nextState;
    case "UPDATE_FILES":
      nextState.apps[app.appId].files = app.files;
      return nextState;
    //
    // action.payload is not an app
    //
    case "UPDATE_NAME":
      nextState.name = action.payload;
      return nextState;
    case "TOGGLE_LEFT_NAV":
      nextState.leftNavOpen = action.payload;
      return nextState;
    //
    // placeholders
    //
    case "UPDATE_FILES_SUCCESS":
      console.log("UPDATE_FILES_SUCCESS");
      return state;
    case "CREATE_APP_SUCCESS":
      console.log("CREATE_APP_SUCCESS");
      return state;
    default:
      return state;
  }
}
