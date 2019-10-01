var path = require('path');
var express = require('express');
var app = express();  
var server = require('http').createServer(app);
var io = require('socket.io')(server);

const ENV = process.env.NODE_ENV || "development"; 
const PORT = process.env.PORT || 8001;
const apiState = {};

app.use(express.static(path.join(__dirname, '../public')));

// app.get('/', function (req, res) {
//   res.sendFile(path.join(__dirname, '../index.html'));
//   console.log("In API server.");
// });

const socket = io.on('connect', function(socket) {
  console.log((new Date().toISOString()) + ' ID ' + socket.id + ' connected.');

  // create user object for additional data
  apiState[socket.id] = {
    inGame: null,
    player: null
  };

  socket.on('appFeed', (feed) => {
    console.log("Received feed from client in server:", feed);
  });

  socket.on('shotFeed', (feed) => {
    sendShot(feed);
    console.log("Received feed from client in server:", feed);
  });

}); // end of io.on wrapping all socket listeners

  // Simulate sending a shot to the App
function sendShot(target) {
  socket.emit('serverFeed', target);
};


server.listen(PORT, () => {
  console.log(`Listening on port ${PORT} in ${ENV} mode.`);
});