import { AppForm } from "./components/app-form";
import { Route } from "react-router-dom";
import React, { Component } from "react";

export const Routes =(props)=> (
  <div>
    <Route exact path="/" component={AppForm} />
    <Route path="/apps/:appId" component={ShowApp} />
    <Route path="/about" component={About} />
  </div>
);

const ShowApp =({ match })=> (
  <h3>{match.params.appId}</h3>
);

const About =()=> (
  <div>
    <h2>About</h2>
  </div>
);
