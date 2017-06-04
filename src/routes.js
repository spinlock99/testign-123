import db from "./data/db";
import { Apps } from "./apps"
import { AppsShow } from "./apps/show"
import { Redirect, Route, withRouter } from "react-router-dom"
import React from "react"
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Field, reduxForm } from "redux-form";
import RaisedButton from "material-ui/RaisedButton";
import { TextField } from "redux-form-material-ui";

export const Routes = props =>
  <div>
    <AuthButton />
    <Route path="/login" component={ReduxLogin} />
    <Route path="/about" component={props => <h2>About</h2>} />
    <PrivateRoute exact path="/" component={Apps} />
    <PrivateRoute path="/apps/:appId" component={AppsShow} />
  </div>

const PrivateRoute = ({ component: Component, ...rest }) =>
  <Route {...rest} render={props => auth.authenticated
    ? <Component {...props} />
    : <Redirect to={{ pathname: "/login", state: { from: props.location } }} />
  } />

const auth = {
  authenticated: false,
  signout(callBack) {
    this.authenticated = false
    setTimeout(callBack, 100)
  },
  authenticate(githubToken, callBack) {
    this.authenticated = true
    db.table("githubTokens").add({ token: githubToken }).then(id =>
      callBack())
  }
}

const centered = { margin: "20px auto", textAlign: "center", width: "100%" }
const handleClick = props => e => auth.signout(o=> props.history.push("/"))

const AuthButton = withRouter(props => auth.authenticated
  ? <button onClick={handleClick(props)}>Sign Out</button>
  : <div style={centered}>You are Logged Out</div>
)

class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = { redirectToReferrer: false }
    this.login = this.login.bind(this)
  }

  login(values) {
    console.log("values: ", values)
    auth.authenticate(values.githubToken, o=> this.setState({ redirectToReferrer: true }))
  }

  render() {
    if (this.state.redirectToReferrer) {
      return <Redirect to={{ pathname: "/" }} />
    }
    return <LoginForm onSubmit={this.login} />
  }
}

const ReduxLogin = connect(
  state => ({}),
  dispatch => bindActionCreators({}, dispatch)
)(props => <Login {...props} />)

const flushRight = { float: "right", marginTop: "20px" };

const LoginForm = reduxForm({ form: "login" })(props =>
  <form style={{ margin: 20 }} onSubmit={props.handleSubmit}>
    <div>
      <label htmlFor="githubToken">Github Token:</label>
      <Field component={TextField}
             hintText="Enter Github Token"
             name="githubToken" />
    </div>
    <RaisedButton style={flushRight} type="submit">Submit</RaisedButton>
  </form>
)
