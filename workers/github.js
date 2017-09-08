const zmq = require("zeromq")
const spawn = require("child_process").spawn
const axios = require("axios")
require("promise.prototype.finally").shim()
const path = require("path")

const subscriber = zmq.socket("sub")
subscriber.subscribe("github")
subscriber.connect("tcp://localhost:5556")

const publisher = zmq.socket("pub")
publisher.bindSync("tcp://*:5557")

subscriber.on("message", function (channel, data) {
  const { handle, name, token } = JSON.parse(data.toString())

  const postData = (query, variables="{}") => ({ query , variables })
  const findRepository = ` query {
    // TODO: support more github users than just me :(
    repository(owner:"spinlock99", name: "${name}") {
      id
    }
  }`

  const github = axios.create({
    baseURL: "https://api.github.com/",
    headers: { "Authorization": "bearer " + token }
  })
  github.post("graphql", postData(findRepository))
  .then(repository => {
    if (!repository.data.data.repository) {
      console.log("creating repo ...")
      return github.post("user/repos", {
        name: name,
        auto_init: true,
        private: false
      })
      .then(data => console.log("repo created"))
    } else {
      console.log("repo exists: ", repository.data.data)
    }
  })
  .catch(errors =>  console.log("errors: oops", errors))
  .finally(data => {
    const script = path.join(__dirname, "github.sh")
    const upload = spawn(script, [name, name.replace(/\s+/g, '-'), handle, token])
    upload.stdout.on("data", output => console.log("stdout: " + output))
    upload.stderr.on("data", error => console.log("stderr: " + error))
    upload.on("exit", code => {
      publisher.send(["github", "Success: github upload complete"])
      console.log("github upload exited with code: " + code)
    })
  })
})
