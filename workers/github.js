const zmq = require("zmq")
const exec = require("child_process").exec
const axios = require("axios")
require("promise.prototype.finally").shim()

const subscriber = zmq.socket("sub")
subscriber.subscribe("")

subscriber.on("message", function (data) {
  const { handle, name, token } = JSON.parse(data.toString())

  const postData = (query, variables="{}") => ({ query , variables })
  const findRepository = ` query {
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
  .finally(data =>
    exec(`cd /tmp/todo-pwa/; \
      git co template; \
      git pull; \
      git co -B ${name.replace(/\s+/g, '-')}; \
      for file in manifest.json src/index.ejs webpack.dev.js webpack.prod.js
      do
        echo "migrating $file"; \
        sed \
          -i.backup \
          -e "s|NAME|${name}|" \
          -e "s|ICON|https://process.filestackapi.com/resize=width:144/${handle}|" $file; \
        rm $file.backup; \
        git add $file; \
      done
      git commit -m "updated icon"; \
      git push -f "https://spinlock99:${token}@github.com/spinlock99/${name.replace(/\s+/g, '-')}.git" ${name.replace(/\s+/g, '-')}:master; \
      git co template`,
      (e, stdout, stderr) => {
        if (e instanceof Error) {
          console.error(e);
          throw e;
        }
        console.log('stdout ', stdout);
        console.log('stderr ', stderr);
      }
    )
  )
})

subscriber.connect("tcp://localhost:5556")
