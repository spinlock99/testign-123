const zmq = require("zmq")
const spawn = require("child_process").spawn
const axios = require("axios")
require("promise.prototype.finally").shim()
const path = require("path")

const subscriber = zmq.socket("sub")
subscriber.subscribe("webhook")

subscriber.on("message", function (channel, data) {
  console.log("channel: ", channel.toString())

  const jsonData = JSON.parse(data.toString())
  console.log("jsonData: ", jsonData)
})

subscriber.connect("tcp://localhost:5556")
