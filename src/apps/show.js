export const AppsShow = connect(
  (state, ownProps) => ({
    apps: state.apps,
    appId: getAppId(state, ownProps),
    files: getFiles(state, ownProps)
  }),
  dispatch => bindActionCreators({ updateFiles }, dispatch)
)(({ apps, appId, files, updateFiles }) =>
  <div>
    <AppName name={apps[appId].name} />
    {!!files.length && files.map(file =>
      <img key={file.handle} src={file.url} style={imgCenter} />)}
    <Upload appId={appId} updateFiles={updateFiles} />
  </div>
);

const AppName = ({ name }) => <h3 style={{ marginLeft: "5vw" }}>{name}</h3>;

const Upload = ({ appId, updateFiles }) =>
  <ReactFilestack
    apikey={FILESTACK_API_KEY}
    buttonText="Add Icon"
    onSuccess={result => updateFiles(appId, result)}
    render={({ onPick }) =>
      <div style={upload}>
        <RaisedButton
          label="Upload a File"
          onClick={onPick} />
      </div>}
  />;

const getAppId = (state, props) => props.match.params.appId;
const getApp = state => state.apps;
const getFiles = createSelector(
  getAppId,
  getApp,
  (appId, apps) => apps[appId].files || []
);

const imgCenter = { width: "90vw", display: "block", margin: "0 auto" };
const upload = { marginTop: "40vh", textAlign: "center" };

import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import ReactFilestack from "react-filestack";
import RaisedButton from "material-ui/RaisedButton";
import { updateFiles } from "../data/actions";
import { createSelector } from "reselect";
