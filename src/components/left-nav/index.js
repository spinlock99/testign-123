import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import Drawer from "material-ui/Drawer";
import { NavLink } from "react-router-dom";

const toggleLeftNav = open => ({ type: "TOGGLE_LEFT_NAV", payload: open });
const closeLeftNav = event => ({ type: "TOGGLE_LEFT_NAV", payload: false });
const activeStyle = { color: "red" };

export const LeftNav = connect(
  state => ({ open: state.leftNavOpen }),
  dispatch => bindActionCreators({ closeLeftNav, toggleLeftNav }, dispatch)
)(props => (
  <Drawer
    docked={false}
    width={200}
    open={props.open}
    onRequestChange={props.toggleLeftNav}
  >
    <NavLink
      exact
      to="/"
      onClick={props.closeLeftNav}
      activeStyle={activeStyle}
    >Home</NavLink>
    <br />
    <NavLink
      to="/about"
      onClick={props.closeLeftNav}
      activeStyle={activeStyle}
    >About</NavLink>
  </Drawer>
));
