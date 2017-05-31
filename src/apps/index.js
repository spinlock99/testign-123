import React from "react";
import { Link } from "react-router-dom";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { createApp, updateName } from "../actions";
import Divider from "material-ui/Divider";
import RaisedButton from "material-ui/RaisedButton";
import TextField from "material-ui/TextField";


export const Apps = connect(
  function mapStateToProps(state) {
    const apps = Object.keys(state.apps).map(key => state.apps[key]);
    return { name: state.name, apps };
  },
  function mapDispatchToProps(dispatch) {
    return bindActionCreators({ createApp, updateName }, dispatch);
  }
)(({ apps, createApp, name, updateName }) => {
  const handleClick = event => createApp(name);
  function handleKeyUp(event) {
    if (event.which === 13) {
      createApp(name);
      updateName("");
    } else if (event.which === 8) {
      updateName(name.slice(0, -1));
    } else {
      updateName(name + event.key);
    }
  }

  return (
    <div style={{ padding: "20px" }}>
      <TextField
        value={name}
        hintText="Enter App Name"
        fullWidth={true}
        onKeyUp={handleKeyUp}
      />
      <RaisedButton
        label="Create App"
        primary={true}
        fullWidth={true}
        onClick={handleClick}
      />
      {!!apps.length && apps.map(app => (
        <div key={app.id}>
          <Link to={`/apps/${app.id}`}>{app.name}</Link><br />
        </div>
      ))}
    </div>
  );
});
