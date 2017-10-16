import { List, Map } from "immutable";

const SET_CURRENT_USER = "SET_CURRENT_USER"

export function sessionReducer(state=Map({ currentUser: null }), action) {
  switch(action.type) {
    case SET_CURRENT_USER:
      const currentUser = Map({
        githubUsername: action.payload.githubUsername,
        githubToken: action.payload.githubToken
      })
      const nextState = state.set('currentUser', currentUser)
      return nextState
    default:
      return state
  }
}

//
// add user to session
//
export function setCurrentUser(user) {
  return {
    type: SET_CURRENT_USER,
    payload: user
  }
}

