import React from "react"
import { Redirect } from "react-router-dom"
import AddAPhoto from "material-ui/svg-icons/image/add-a-photo"
import { bindActionCreators } from "redux"
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import CircularProgress from "material-ui/CircularProgress"
import CloudUpload from "material-ui/svg-icons/file/cloud-upload"
import { connect } from "react-redux"
import ContentAdd from "material-ui/svg-icons/content/add"
import FloatingActionButton from "material-ui/FloatingActionButton"
import GitHub from "github-api"
import ReactFilestack from "filestack-react"
import RaisedButton from "material-ui/RaisedButton"
import Snackbar from "material-ui/Snackbar"
import { clearFlash, updateFiles } from "../data/actions"
import { createSelector } from "reselect"
import axios from "axios"

/*
 * Style Helpers
 */
const imgCenter = { width: "90vw", display: "block", margin: "0 auto" }
const upload = { position: "absolute", bottom: "15vh", right: "5vw" }
const progress = { position: "relative", marginTop: 7 }

/*
 * Component Helpers
 */
const AppName = props => <h3 style={{ marginLeft: "5vw" }}>{props.name}</h3>

const Portfolio = props =>
  <div>
    <img
      style={{ margin: "5vw" }}
      src={
        `https://process.filestackapi.com/resize=width:140/
          ${props.file.handle}`
      } />
  </div>

const UploadIcon = ({ appId, updateFiles }) =>
  <ReactFilestack
    apikey={FILESTACK_API_KEY}
    buttonText="Add Icon"
    onSuccess={result => updateFiles(appId, result)}
    render={({ onPick }) =>
      <div style={upload}>
        <FloatingActionButton onClick={onPick}>
          <AddAPhoto />
        </FloatingActionButton>
      </div>} />

const UploadRepo = props =>
  <div style={upload}>
    <FloatingActionButton disabled={props.loading} onClick={props.handleClick}>
      { props.loading
        ? <CircularProgress style={progress} size={40} thickness={5} />
        : <CloudUpload />
      }
    </FloatingActionButton>
  </div>

const CardExampleWithAvatar = props => (
  <Card>
    <CardMedia
      overlay={<CardTitle title={props.name} subtitle="Overlay subtitle" />}
    >
      <img
        src={`https://process.filestackapi.com/resize=width:600/
          ${props.file.handle}`}
        alt="" />
    </CardMedia>
    <CardText>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
      Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
      Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
    </CardText>
    <CardActions>
    </CardActions>
  </Card>
)

/*
 * Event Handlers
 */
const handleClick = (currentUser, app) => dispatch => event => {
  dispatch({ type: "SET_LOADING", payload: true })
  axios.post("/apps/github", {
    "handle": app.files[0].handle,
    "name": app.name,
    "currentUser": currentUser
  })
}

/*
 * State Selectors
 */
const getAppId = (state, props) => props.match.params.appId
const getApps = state => !!Object.keys(state.apps).length ? state.apps : false
const getFiles = createSelector(
  getAppId,
  getApps,
  (appId, apps) => !apps ? false : apps[appId].files
)

export const AppsShow = connect(
  (state, ownProps) => ({
    apps: getApps(state),
    appId: getAppId(state, ownProps),
    files: getFiles(state, ownProps),
    flash: state.flash,
    loading: state.loading,
    currentUser: state.session.get('currentUser').toJSON()
  }),
  dispatch => bindActionCreators({
    clearFlash,
    handleClick,
    updateFiles
  }, dispatch)
)(props =>
  !props.apps[props.appId]
  ? <Redirect to={{ pathname: '/' }}/>
  : <div>
      {!props.files
        ? <UploadIcon appId={props.appId} updateFiles={props.updateFiles} />
        : <div>
            <CardExampleWithAvatar
              file={props.files[0]}
              name={props.apps[props.appId].name} />
            <UploadRepo
              handleClick={props.handleClick(props.currentUser, props.apps[props.appId])}
              loading={props.loading} />
          </div>
      }
      <Snackbar
        open={!!props.flash.length}
        message={props.flash}
        autoHideDuration={4000}
        onRequestClose={props.clearFlash} />
    </div>
)
