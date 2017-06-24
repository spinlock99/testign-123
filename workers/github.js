const zmq = require("zmq")
const exec = require("child_process").exec
const axios = require("axios")
require("promise.prototype.finally").shim()

const subscriber = zmq.socket("sub")
subscriber.subscribe("")

subscriber.on("message", function (data) {
  const { handle, name, token } = JSON.parse(data.toString())
  console.log("creating repo ...")

  axios
  .create({
    baseURL: "https://api.github.com/",
    headers: { "Authorization": "bearer " + token }
  })
  .get("user/repos")
  .then(repos => {
    if (!repos.filter(repo => repo.name === name)) {
      axios
      .create({
        baseURL: "https://api.github.com/",
        headers: { "Authorization": "bearer " + token }
      })
      .post("user/repos", {
        name: name,
        auto_init: true,
        private: false
      })
      .then(data => console.log("repo created"))
    }
  })
  .catch(errors =>  console.log("errors: oops"))
  .finally(() =>
    exec(`cd /tmp/todo-pwa/; \
      sed -i.backup "s|ICON|https://process.filestackapi.com/resize=width:140/${handle}|" manifest.json; \
      rm manifest.json.backup; \
      git add manifest.json; \
      git commit -m "updated icon"; \
      git push -f "https://spinlock99:${token}@github.com/spinlock99/test-app.git" test-app:master`,
      (event, stdout, stderr) => {
        if (event instanceof Error) {
          console.error(event);
          throw e;
        }
        console.log('stdout ', stdout);
        console.log('stderr ', stderr);
      }
    )
  )
})

subscriber.connect("tcp://localhost:5556")
