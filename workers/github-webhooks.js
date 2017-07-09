const zmq = require("zmq")
const spawn = require("child_process").spawn
const axios = require("axios")
require("promise.prototype.finally").shim()
const path = require("path")

const subscriber = zmq.socket("sub")
subscriber.subscribe("github-webhook")

subscriber.on("message", function (channel, data) {
  constole.log("channel: ", channel)
  console.log(data)
})
