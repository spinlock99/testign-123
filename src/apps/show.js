export const AppsShow = connect(
  (state, ownProps) => ({
    apps: getApps(state),
    appId: getAppId(state, ownProps),
    files: getFiles(state, ownProps)
  }),
  dispatch => bindActionCreators({ updateFiles }, dispatch)
)(({ apps, appId, files, updateFiles }) =>
  !apps[appId] ? <Redirect to={{ pathname: '/' }}/> :
  <div>
    <AppName name={apps[appId].name} />
    {files && files.map(file =>
      <div key={file.handle}>
        <img
          style={{ margin: "5vw" }}
          src={`https://process.filestackapi.com/resize=width:140/${file.handle}`} />
        <img
          style={{ margin: "5vw" }}
          src={`https://process.filestackapi.com/resize=width:152/${file.handle}`} />
        <img
          style={{ margin: "5vw" }}
          src={`https://process.filestackapi.com/resize=width:167/${file.handle}`} />
        <img
          style={{ margin: "5vw" }}
          src={`https://process.filestackapi.com/resize=width:180/${file.handle}`} />
      </div>)}
    <Upload appId={appId} updateFiles={updateFiles} />
  </div>
);

const AppName = ({ name }) => <h3 style={{ marginLeft: "5vw" }}>{name}</h3>

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
      </div>} />

const getAppId = (state, props) => props.match.params.appId;
const getApps = state => !!Object.keys(state.apps).length ? state.apps : false;
const getFiles = createSelector(
  getAppId,
  getApps,
  (appId, apps) => !apps ? false : apps[appId].files
);

const imgCenter = { width: "90vw", display: "block", margin: "0 auto" };
const upload = { marginTop: "40vh", textAlign: "center" };

import React from "react";
import { Redirect } from "react-router-dom";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import ReactFilestack from "react-filestack";
import RaisedButton from "material-ui/RaisedButton";
import { updateFiles } from "../data/actions";
import { createSelector } from "reselect";
