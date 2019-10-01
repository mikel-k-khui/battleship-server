var express = require('express');  
var app = express();  
var server = require('http').createServer(app);
var io = require('socket.io')(server);

const ENV = process.env.NODE_ENV || "development"; 
const PORT = process.env.PORT || 8001;
const apiState = {};

app.use(express.static('/public'));

// app.get('/', function (req, res) {
//   console.log("In API server:", res);
// });

io.on('connect', function(socket) {
  console.log((new Date().toISOString()) + ' ID ' + socket.id + ' connected.');

  // create user object for additional data
  apiState[socket.id] = {
    inGame: null,
    player: null
  };

  socket.on('appFeed', (feed) => {
    console.log("Received feed from client in server:", feed);
  });

  socket.emit('serverFeed', (feed) => {
    console.log("Sending feed from server to client:", feed);
  });

}); // end of io.on wrapping all socket listeners

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT} in ${ENV} mode.`);
});