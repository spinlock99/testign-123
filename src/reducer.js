import { List, Map } from "immutable";

const uuid = a=>a?(a^Math.random()*16>>a/4).toString(16):([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,uuid);

const initialState = {
  name: "",
  apps: {}
};

export default function(state=initialState, action) {
  let nextState = { ...state };
  console.log(action);

  switch(action.type) {
    case "CREATE_APP":
      nextState.apps[uuid()] = { name: state.name };
      nextState.name = "";
      return nextState;
    case "UPDATE_NAME":
      nextState.name = action.payload;
      return nextState;
    default:
      return state;
  }
}
