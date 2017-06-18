export const AppsShow = connect(
  (state, ownProps) => ({
    apps: getApps(state),
    appId: getAppId(state, ownProps),
    files: getFiles(state, ownProps),
    token: state.token
  }),
  dispatch => bindActionCreators({ updateFiles }, dispatch)
)(({ apps, appId, files, token, updateFiles }) =>
  !apps[appId] ? <Redirect to={{ pathname: '/' }}/> :
  <div>
    <AppName name={apps[appId].name} />
    {files && <RaisedButton label="Upload to Github" onClick={handleClick(token)} />}
    {files && files.map(file => <Portfolio key={file.handle} file={file} />)}
    {!files && <Upload appId={appId} updateFiles={updateFiles} />}
  </div>
);

const handleClick = token => event =>
  axios.post("https://api.github.com/graphql", {
      //
      // query the schema
      // query: " query { __schema { types { name kind description fields { name } } } } ",
      //
      query: "query($numberOfRepos:Int!) { viewer { login name repositories(last: $numberOfRepos) { nodes { name } } } }",
      variables: '{ "numberOfRepos": 3 }'
    },
    { headers: { "Authorization": "bearer " + token} }
  ).then(({ data: { data, errors } }) => !!errors
    ? errors.forEach(error => console.log("Github Error: ", error.message))
    : console.log(data))


const AppName = ({ name }) => <h3 style={{ marginLeft: "5vw" }}>{name}</h3>

const Portfolio = ({ file }) =>
  <div>
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
  </div>

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

const getAppId = (state, props) => props.match.params.appId

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
import ContentAdd from "material-ui/svg-icons/content/add";
import FloatingActionButton from "material-ui/FloatingActionButton";
import GitHub from "github-api";
import ReactFilestack from "react-filestack";
import RaisedButton from "material-ui/RaisedButton";
import { updateFiles } from "../data/actions";
import { createSelector } from "reselect";
import axios from "axios";
