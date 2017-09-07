const bodyParser = require("body-parser")
var express = require("express")
var path = require("path")
const zmq = require("zeromq")

var app = express()
app.use(bodyParser.json())

const publisher = zmq.socket("pub")
publisher.bindSync("tcp://*:5556")

app.post("/github", function (req, res) {
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
  app.use(express.static(path.join(__dirname + "/bin")))
} else {
  // require development only packages

  var webpack = require("webpack")
  var webpackDevMiddleware = require("webpack-dev-middleware")
  var webpackHotMiddleware = require("webpack-hot-middleware")
  var config = require("./webpack.dev.js")

  var compiler = webpack(config)
  app.use(webpackDevMiddleware(compiler, { publicPath: config.output.publicPath }))
  app.use(webpackHotMiddleware(compiler))
  app.get("*", function (req, res, next) {
    compiler.outputFileSystem.readFile(path.join(__dirname, "index.html"), function (err, result) {
      if (err) { return next(err) }
      res.set('content-type', 'text/html')
      res.send(result)
      res.end()
    })
  })
}

app.listen(8080, function () {
  console.log("Atomic Apps listening on port 8080")
})
