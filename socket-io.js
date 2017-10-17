const port = 8000
const io = require('socket.io')()
const path = require("path")
const zmq = require("zeromq")
const zmqSockets = require(path.join(__dirname + "/config/zeromq.json"))

const subscriber = zmq.socket("sub")
subscriber.subscribe("github")
subscriber.connect(zmqSockets["web-socket-sub"])

io.on("connection", client => {
  subscriber.on("message", function (channel, data) {
    client.emit("redux", { type: "FLASH", payload: data.toString() })
    client.emit("redux", { type: "SET_LOADING", payload: false })
  })

  console.log("a user connected");
  client.on("subscribeToTimer", (interval) => {
    console.log("a user is subscribing to timer with interval: ", interval)
    setInterval(() => {
      timestamp = new Date()
      client.emit('timer', { type: 'SET_TIME', payload: timestamp })
    }, interval)
  });
})

io.listen(port, () => console.log('listening on port ', port))
