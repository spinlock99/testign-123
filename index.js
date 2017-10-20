import React from "react"
import { render } from "react-dom"
import { App } from "./src/app"
import { materialUI, googleAnalytics } from "./src/initializers"
import OfflinePluginRuntime from "offline-plugin/runtime"

googleAnalytics()
materialUI()
OfflinePluginRuntime.install()

const containerEl = document.getElementById("container")
render(<App />, containerEl)
