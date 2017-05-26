import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

export const AppsShow = connect(
  (state, ownProps) => ({
    apps: state.apps,
    match: ownProps.match
  }),
  (dispatch) => ({})
)(({ apps, match }) => (
  <h3>{apps[match.params.appId].name}</h3>
));
