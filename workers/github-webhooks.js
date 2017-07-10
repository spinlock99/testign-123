const zmq = require("zmq")
const exec = require("child_process").exec
const axios = require("axios")
require("promise.prototype.finally").shim()
const path = require("path")

const subscriber = zmq.socket("sub")
subscriber.subscribe("webhook")

subscriber.on("message", function (channel, data) {
  console.log("channel: ", channel.toString())

  const { action, pull_request } = JSON.parse(data.toString())
  if (action === 'closed' && pull_request['merged']) {
    console.log("merged :)")
    exec(
      "cd /home/spinlock/atomic-apps; git checkout master; git pull; yarn; yarn build; pm2 restart all",
      function (error, stdout, stderr) {
        console.log("stdout: ", stdout)
        console.log("sterr: ", stderr)
        console.log("exited with code: ", error ? error.code : 0)
      }
    )
  } else {
    console.log("not merged :(")
  }
})

subscriber.connect("tcp://localhost:5556")
