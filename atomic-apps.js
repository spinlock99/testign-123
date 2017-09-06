var express = require("express")
var path = require("path")
var webpack = require("webpack")
var webpackDevMiddleware = require("webpack-dev-middleware")
var webpackHotMiddleware = require("webpack-hot-middleware")
var config = require("./webpack.dev.js")

const bodyParser = require("body-parser")
const zmq = require("zeromq")

var app = express()
app.use(bodyParser.json())
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname + "/bin")))
}

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

app.listen(8080)
console.log("Atomic Apps listening on port 8080")
