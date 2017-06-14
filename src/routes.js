import { Apps } from "./apps"
import { AppsShow } from "./apps/show"
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import db from "./data/db";
import { Field, reduxForm } from "redux-form";
import RaisedButton from "material-ui/RaisedButton";
import React from "react"
import { Redirect, Route, withRouter } from "react-router-dom"
import { TextField } from "redux-form-material-ui";

const centered = { margin: "20px auto", textAlign: "center", width: "100%" }
const flushRight = { float: "right", marginTop: "20px" };

export const Routes = props =>
  <div>
    <Route path="/login" component={ReduxLogin} />
    <Route path="/about" component={props => <h2>About</h2>} />
    <PrivateRoute exact path="/" component={Apps} dispatch={props.dispatch} />
    <PrivateRoute path="/apps/:appId" component={AppsShow} dispatch={props.dispatch} />
  </div>

class PrivateRoute extends React.Component {
  componentWillUpdate() { this.props.dispatch({ type: "CLEAR_REDIRECT" }) }
  render() {
    const { component: Component, ...rest } = this.props
    return(
      <Route {...rest} render={props => auth.authenticated
          ? <Component {...this.props} />
          : <Redirect to={{ pathname: "/login", state: { from: this.props.location } }} />
      } />
    )
  }
}

const auth = {
  authenticated: false,
  signout(callBack) {
    this.authenticated = false
    setTimeout(callBack, 100)
  },
  authenticate(callBack) {
    this.authenticated = true
    callBack()
  }
}

const ReduxLogin = connect(
  state => ({}),
  dispatch => bindActionCreators({}, dispatch)
)(props => <Login {...props} />)

class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = { redirectToReferrer: false, loading: true }
    this.login = this.login.bind(this)
    db.table("githubTokens").toArray().then( tokens => tokens.length > 0
      ? auth.authenticate(o=> this.setState({ redirectToReferrer: true, loading: false }))
      : this.setState({ loading: false }))
  }

  login(values) {
    console.log("values: ", values)
    db.table("githubTokens").add({ githubToken: values.githubToken }).then(
      id => auth.authenticate(o=> this.setState({ redirectToReferrer: true })))
  }

  render() {
    if (this.state.loading) { return <span>loading</span> }
    if (this.state.redirectToReferrer) {
      return <Redirect to={{ pathname: "/" }} />
    }
    return <LoginForm onSubmit={this.login} />
  }
}

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
