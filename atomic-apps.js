const bodyParser = require("body-parser")
const express = require("express")
const path = require("path")
const zmq = require("zeromq")
const zmqSockets = require(path.join(__dirname + "/config/zeromq.json"))

const app = express()
app.use(bodyParser.json())

const publisher = zmq.socket("pub")
publisher.bindSync(zmqSockets["worker-pub"])

app.post("/apps/github", function (req, res) {
  console.log("/github")
  publisher.send(["github", JSON.stringify(req.body)])
  res.sendStatus(200)
})

app.post("/github-webhook", function (req, res) {
  console.log("/github-webhook")
  publisher.send(["webhook", JSON.stringify(req.body)])
  res.sendStatus(200)
})

/*
 *  Static Assets
 *
 *  production -- serve static assets from /bin
 *  development -- use webpack middleware to compile and serve assets
 */
if (process.env.NODE_ENV === "production") {
  app.use('/apps', express.static(path.join(__dirname + "/bin")))
} else {
  // require development only packages

  const webpack = require("webpack")
  const webpackDevMiddleware = require("webpack-dev-middleware")
  const webpackHotMiddleware = require("webpack-hot-middleware")
  const config = require(path.join(__dirname + "/webpack.dev.js"))

  const compiler = webpack(config)
  app.use(webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath
  }))
  app.use(webpackHotMiddleware(compiler))
  app.get("*", function (req, res, next) {
    compiler.outputFileSystem.readFile(
      path.join(__dirname, "index.html"),
      function (err, result) {
        if (err) { return next(err) }
        res.set('content-type', 'text/html')
        res.send(result)
        res.end()
      }
    )
  })
}

app.listen(8080, function () {
  console.log("Atomic Apps listening on port 8080")
})
