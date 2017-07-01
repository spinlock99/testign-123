var express = require("express")
var app = express()
var path = require("path")
const bodyParser = require("body-parser")
const zmq = require("zmq")

app.use(express.static(path.join(__dirname + "/bin")))
app.use(bodyParser.json())

const publisher = zmq.socket("pub")
publisher.bindSync("tcp://*:5556")

/*
app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'accept, content-type, x-parse-application-id, x-parse-rest-api-key, x-parse-session-token');
   // intercept OPTIONS method
  if ('OPTIONS' == req.method) {
    res.sendStatus(200);
  }
  else {
    next();
  }
});
*/
app.post("/github", function (req, res) {
  console.log("/github")
  publisher.send(JSON.stringify(req.body))
  res.sendStatus(200)
})

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname + '/bin/index.html'))
})

app.listen(8080)
console.log("Atomic Apps listening on port 8080")
