import { List, Map } from "immutable";

const initialState = {
  name: "",
  apps: {}
};

export default function(state=initialState, action) {
  let nextState = JSON.parse(JSON.stringify(state));

  switch(action.type) {
    case "CREATE_APP":
      const app = action.payload;
      nextState.apps[app.id] = { id: app.id, name: app.name };
      nextState.name = "";
      return nextState;
    case "UPDATE_NAME":
      nextState.name = action.payload;
      return nextState;
    case "UPDATE_FILES":
      nextState.apps[action.payload.appId].files = action.payload.files;
      return nextState;
    case "TOGGLE_LEFT_NAV":
      nextState.leftNavOpen = action.payload;
      return nextState;
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
