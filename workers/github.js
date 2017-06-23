const zmq = require("zmq")
const exec = require("child_process").exec
const axios = require("axios")

const subscriber = zmq.socket("sub")
subscriber.subscribe("")

subscriber.on("message", function (data) {
  const { name, token } = JSON.parse(data.toString())
  console.log("github worker: ", JSON.parse(data.toString()))

  axios.create({
    baseURL: "https://api.github.com/",
    headers: { "Authorization": "bearer " + token }
  }).post("user/repos", {
    name: name,
    auto_init: true,
    private: false,
    gitignore_template: "nanoc"
  }).then(
    data => console.log("success: ", success),
    errors => console.log("errors: ", errors))

  console.log("repo created")
})

subscriber.connect("tcp://localhost:5556")
