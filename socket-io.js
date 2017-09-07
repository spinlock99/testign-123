const port = 8000
const io = require('socket.io')()

io.on("connection", client => {
  console.log("a user connected");
  client.on("subscribeToTimer", (interval) => {
    console.log("a user is subscribing to timer with interval: ", interval)
    setInterval(() => {
      timestamp = new Date()
      client.emit('timer', { type: 'SET_TIME', payload: timestamp });
    }, interval);
  });
})

io.listen(port, () => console.log('listening on port ', port))
