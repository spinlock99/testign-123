var express = require("express")
var app = express()
var path = require("path")

app.use(express.static(path.join(__dirname + "/bin")))

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname + '/bin/index.html'))
})

app.listen(8080)
console.log("Atomic Apps listening on port 8080")
