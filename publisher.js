const express = require("express")
const bodyParser = require("body-parser")
const zmq = require("zmq")

const app = express()
app.use(bodyParser.json())

const publisher = zmq.socket("pub")
publisher.bindSync("tcp://*:5556")
publisher.bindSync("ipc://weather.ipc")

app.all('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'accept, content-type, x-parse-application-id, x-parse-rest-api-key, x-parse-session-token');
     // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
});

app.get("/", function (req, res) {
  publisher.send("wat")
  res.send("hello world")
})

app.post("/", function (req, res) {
  publisher.send(req.body.wat)
  res.send("hello post")
})

app.listen(8000, function () {
  console.log("listening on port 8000")
})
