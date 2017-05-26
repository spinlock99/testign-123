import React from "react";
import { Link } from "react-router-dom";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { createApp, updateName } from "../../actions";
import Divider from "material-ui/Divider";
import RaisedButton from "material-ui/RaisedButton";
import TextField from "material-ui/TextField";


export const AppForm = connect(
  function mapStateToProps(state) {
    const apps = Object.keys(state.apps).map(key => state.apps[key]);
    return { name: state.name, apps };
  },
  function mapDispatchToProps(dispatch) {
    return bindActionCreators({ createApp, updateName }, dispatch);
  }
)(({ apps, createApp, name, updateName }) => {
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
      {!!apps.length && apps.map(app => (
        <div>
          <Link to={`/apps/${app.id}`} key={app.id}>{app.name}</Link><br />
        </div>
      ))}
    </div>
  );
});
