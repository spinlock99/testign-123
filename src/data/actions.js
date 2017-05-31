import db from "./db";
const uuid = a=>a?(a^Math.random()*16>>a/4).toString(16):([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,uuid);

//
// name is just what's shown in the input so that it can be synchronized between
// elements on the page.
// It is not stored in the database.
//
export function updateName(name) {
  return {
    type: "UPDATE_NAME",
    payload: name
  }
}

//
// we now pass in the name so that we can create the app in the database then
// add it to redux
//
export function createApp(name) {
  return (dispatch, getState) => {
    const app = { id: uuid(), name: getState().name };
    dispatch({ type: "CREATE_APP", payload: app });
    db.table("apps").add(app).then(id => {
      dispatch({ type: "CREATE_APP_SUCCESS" });
    });
  }
}

//
// add uploaded files to the app
//
export function updateFiles(appId, result) {
  return dispatch => {
    dispatch({
      type: "UPDATE_FILES",
      payload: {
        appId,
        files: result.filesUploaded
      }
    });
    db.table("apps").update(appId, { files: result.filesUploaded }).then(success => {
      console.log("UPDATE_FILES_SUCCESS");
      dispatch({ type: "UPDATE_FILES_SUCCESS" })
    });
  }
}

export function addTodo(text) {
  return dispatch => {
    const todo = { text, isDone: false };
    db.table("todos").add(todo).then(id => {
      dispatch(addToRedux({ id, text }));
    });
  };
}
function addToRedux({ id, text }) {
  return(
    {
      type: "ADD_TODO",
      payload: {
        id,
        isDone: false,
        text: text
      }
    }
  );
}

export function toggleTodo(id, isDone) {
  return dispatch => {
    db.table("todos").update(id, { isDone: !isDone }).then(() => {
      dispatch(toggleInRedux(id));
    });
  };
}

function toggleInRedux(id) {
  return {
    type: "TOGGLE_TODO",
    payload: id
  };
}

export function clearTodos() {
  return dispatch => {
    db.todos.filter(todo => todo.isDone).delete().then(
      () => dispatch(clearInRedux())
    );
  };
}

function clearInRedux() {
  return {
    type: "CLEAR_TODOS"
  };
}
