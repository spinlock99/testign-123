export const Apps = connect(
  (state) => ({
    name: state.name,
    apps: Object.keys(state.apps).map(key => state.apps[key])
  }),
  (dispatch) => bindActionCreators({ createApp, updateName }, dispatch)
)(({ apps, createApp, name, updateName }) =>
  <div style={{ padding: "20px" }}>
    <TextField
      value={name}
      hintText="Enter App Name"
      fullWidth={true}
      onKeyUp={event => {
        if (event.which === 13) {
          createApp(name);
          updateName("");
        } else if (event.which === 8) {
          updateName(name.slice(0, -1));
        } else {
          updateName(name + event.key);
        }
      }}
    />
    {!!apps.length && apps.map(app => (
      <div key={app.id}>
        <Link to={`/apps/${app.id}`}>{app.name}</Link><br />
      </div>
    ))}
    <RaisedButton
      label="Create App"
      primary={true}
      fullWidth={true}
      onClick={event => createApp(name)}
    />
  </div>
);

import React from "react";
import { Link } from "react-router-dom";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { createApp, updateName } from "../data/actions";
import Divider from "material-ui/Divider";
import RaisedButton from "material-ui/RaisedButton";
import TextField from "material-ui/TextField";
import { Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle } from "material-ui/Toolbar";
