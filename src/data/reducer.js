import { List, Map } from "immutable";

export function appsReducer(state={}, action) {
  const app = action.payload;
  let nextState = JSON.parse(JSON.stringify(state));

  switch(action.type) {
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
    default:
      return state;
  }
}

export function flashReducer(state="", action) {
  switch(action.type) {
    case "FLASH":
      return action.payload
    default:
      return state;
  }
}

export function leftNavOpenReducer(state=false, action) {
  switch(action.type) {
    case "TOGGLE_LEFT_NAV":
      return action.payload
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

export function redirectReducer(state="", action) {
  switch(action.type) {
    case "CREATE_APP_SUCCESS":
      return action.payload
    case "CLEAR_REDIRECT":
      return ""
    default:
      return state
  }
}

export function tokenReducer(state="", action) {
  switch(action.type) {
    case "CREATE_TOKEN":
      return action.payload.githubToken
    case "UPDATE_TOKEN":
    default:
      return state
  }
}

export function socketReducer(state="timestamp not set yet", action) {
  switch(action.type) {
    case "SET_TIME":
      return action.payload
    default:
      return state
  }
}
