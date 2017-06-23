const zmq = require("zmq")
const exec = require("child_process").exec

const subscriber = zmq.socket("sub")
subscriber.subscribe("")

subscriber.on("message", function (data) {
  console.log("github worker")
})

subscriber.connect("tcp://localhost:5556")
