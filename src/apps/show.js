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
    {!files
      ? <UploadIcon appId={appId} updateFiles={updateFiles} />
      : <div>
          <UploadRepo handleClick={handleClick(token, apps[appId])} />
          {files.map(file => <Portfolio key={file.handle} file={file} />)}
        </div>
    }
  </div>
);

const handleClick = (token, app) => event =>
  axios.post("/github", {
    "handle": app.files[0].handle,
    "name": app.name,
    "token": token
  })

const github = token => axios.create({
  baseURL: "https://api.github.com/",
  headers: { "Authorization": "bearer " + token }
})
const data = (query, variables="{}") => ({ query , variables })
//
// Query the Schema:
//
// query: " query { __schema { types { name kind description fields { name } } } } ",
//

//
// Get Last 3 Repos:
//
// query: "query($numberOfRepos:Int!) { viewer { login name repositories(last: $numberOfRepos) { nodes { name } } } }",
//
const findIssueID = ` query {
  repository(owner:"spinlock99", name: "atomic-apps") {
    issue(number: 1) { id }
  }
}`
const addReaction = id => ` mutation {
  addReaction(input: { subjectId: "${id}", content: HEART }) {
    reaction { content }
    subject { id }
  }
}`
const rejectErrors = ({ data: { data, errors } }) =>
  !!errors ? Promise.reject({ errors }) : data

const handleClickOld = token => event =>
  github(token)
    .post("graphql", data(findIssueID))
    .then(rejectErrors)
    .then(data => data.repository.issue.id)
    .then(id => github(token)
      .post("graphql", data(addReaction(id)))
      .then(rejectErrors))
    .catch(errors => console.log("errors: ", errors))

const AppName = ({ name }) => <h3 style={{ marginLeft: "5vw" }}>{name}</h3>

const Portfolio = ({ file }) =>
  <div>
    <img
      style={{ margin: "5vw" }}
      src={`https://process.filestackapi.com/resize=width:140/${file.handle}`} />
  </div>

const UploadIcon = ({ appId, updateFiles }) =>
  <ReactFilestack
    apikey={FILESTACK_API_KEY}
    buttonText="Add Icon"
    onSuccess={result => updateFiles(appId, result)}
    render={({ onPick }) =>
      <div style={upload}>
        <FloatingActionButton onClick={onPick}>
          <ContentAdd />
        </FloatingActionButton>
      </div>} />

const UploadRepo = ({ handleClick }) =>
  <div style={upload}>
    <FloatingActionButton onClick={handleClick}>
      <ContentAdd />
    </FloatingActionButton>
  </div>

const getAppId = (state, props) => props.match.params.appId

const getApps = state => !!Object.keys(state.apps).length ? state.apps : false;

const getFiles = createSelector(
  getAppId,
  getApps,
  (appId, apps) => !apps ? false : apps[appId].files
);

const imgCenter = { width: "90vw", display: "block", margin: "0 auto" };
const upload = { position: "absolute", bottom: "15vh", right: "5vw" };

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
