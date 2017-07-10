const zmq = require("zmq")
const spawn = require("child_process").spawn
const axios = require("axios")
require("promise.prototype.finally").shim()
const path = require("path")

const subscriber = zmq.socket("sub")
subscriber.subscribe("webhook")

subscriber.on("message", function (channel, data) {
  console.log("channel: ", channel.toString())

  const { pull_request } = JSON.parse(data.toString())
  if (pull_request['action'] === 'closed' && pull_request['merged']) {
    console.log("merged :)")
  } else {
    console.log("not merged: ", pull_request)
  }
})

subscriber.connect("tcp://localhost:5556")
