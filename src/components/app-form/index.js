import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { createApp, updateName } from "../../actions";
import Divider from "material-ui/Divider";
import RaisedButton from "material-ui/RaisedButton";
import TextField from "material-ui/TextField";


export const AppForm = connect(
  function mapStateToProps(state) {
    return { name: state.name };
  },
  function mapDispatchToProps(dispatch) {
    return bindActionCreators({ createApp, updateName }, dispatch);
  }
)(({ createApp, name, updateName }) => {
  const handleCreate = event => createApp();
  const handleKeyUp = event => updateName(event.target.value);

  console.log("name: ", name);

  return (
    <div style={{ padding: "20px" }}>
      <TextField defaultValue={name} hintText="Enter App Name" fullWidth={true} onKeyUp={handleKeyUp} />
      {/*todos.map(todo =>
        <div style={{ margin: "20px 0 20px 0" }} key={todo.get("id")}>
          <Divider />
        </div>
      )*/}
      <RaisedButton
        label="Create App"
        primary={true}
        fullWidth={true}
        onClick={handleCreate}
      />
    </div>
  );
});
