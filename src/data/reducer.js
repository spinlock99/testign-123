import { List, Map } from "immutable";

export function appsReducer(state={}, action) {
  const app = action.payload;
  let nextState = JSON.parse(JSON.stringify(state));

  switch(action.type) {
    case "UPDATE_TOKEN":
      nextState.token = action.payload;
      return nextState;
    case "CREATE_TOKEN":
      nextState.authenticated = true;
      return nextState;
    //
    // action.payload is an app
    //
    case "CREATE_APP":
      nextState[app.id] = { id: app.id, name: app.name };
      return nextState;
    case "INSERT_APP":
      nextState[app.id] = app;
      return nextState;
    case "UPDATE_FILES":
      nextState[app.appId].files = app.files;
      return nextState;
    //
    // action.payload is not an app
    //
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

export function leftNavOpenReducer(state=false, action) {
  switch(action.type) {
    case "TOGGLE_LEFT_NAV":
      return action.payload;
    default:
      return state;
  }
}

export function nameReducer(state="", action) {
  switch(action.type) {
    case "UPDATE_NAME":
      return action.payload
    case "CREATE_APP":
      return ""
    default:
      return state
  }
}
