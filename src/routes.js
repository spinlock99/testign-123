import { Apps } from "./apps"
import { AppsShow } from "./apps/show"
import { Route } from "react-router-dom"
import React, { Component } from "react"

export const Routes =(props)=> (
  <div>
    <Route exact path="/" component={Apps} />
    <Route path="/apps/:appId" component={AppsShow} />
    <Route path="/about" component={About} />
  </div>
)

const About =()=> (
  <div>
    <h2>About</h2>
  </div>
)
