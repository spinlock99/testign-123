const zmq = require("zmq")
const exec = require("child_process").exec
const axios = require("axios")

const subscriber = zmq.socket("sub")
subscriber.subscribe("")

subscriber.on("message", function (data) {
  const { name, token } = JSON.parse(data.toString())
  console.log("creating repo ... sucka")

  axios
  .create({
    baseURL: "https://api.github.com/",
    headers: { "Authorization": "bearer " + token }
  })
  .post("user/repos", {
    name: name,
    auto_init: true,
    private: false,
    gitignore_template: "nanoc"
  })
  .then(data => console.log("repo created"))
  .catch(errors =>  console.log("errors: oops"))

})

subscriber.connect("tcp://localhost:5556")
