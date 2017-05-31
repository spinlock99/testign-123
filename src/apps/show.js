import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import ReactFilestack from "react-filestack";
import RaisedButton from "material-ui/RaisedButton";
import { updateFiles } from "../data/actions";
import { createSelector } from "reselect";

const getAppId = (state, props) => props.match.params.appId;
const getApp = state => state.apps;

const getFiles = createSelector(
  getAppId,
  getApp,
  (appId, apps) => apps[appId].files || []
);

export const AppsShow = connect(
  (state, ownProps) => ({
    apps: state.apps,
    appId: getAppId(state, ownProps),
    files: getFiles(state, ownProps)
  }),
  dispatch => bindActionCreators({ updateFiles }, dispatch)
)(({ apps, appId, files, updateFiles }) => {
  const handleSuccess = appId => result => updateFiles(appId, result);
  return(
    <div>
      <h3>{apps[appId].name}</h3>
      {!!files.length && files.map(file => <img key={file.handle} src={file.url} />)}
      <ReactFilestack
        apikey={FILESTACK_API_KEY}
        buttonText="Add Icon"
        onSuccess={handleSuccess(appId)}
        render={({ onPick }) => (
          <div style={{ marginTop: "40vh", textAlign: "center" }}>
            <RaisedButton
              label="Upload a File"
              onClick={onPick}
            />
          </div>
        )}
      />
    </div>
  );
});
