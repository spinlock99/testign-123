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
  function handleCreate(event) { createApp(); }
  function handleKeyUp(event) {
    if (event.which === 13) {
      createApp();
      event.target.value = "";
    };
    updateName(event.target.value);
  }

  return (
    <div style={{ padding: "20px" }}>
      <TextField
        hintText="Enter App Name"
        fullWidth={true}
        onKeyUp={handleKeyUp}
      />
      <RaisedButton
        label="Create App"
        primary={true}
        fullWidth={true}
        onClick={handleCreate}
      />
    </div>
  );
});
