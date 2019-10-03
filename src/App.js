var path = require('path');
var express = require('express');
var app = express();  
var server = require('http').createServer(app);
var io = require('socket.io')(server);

const ENV = process.env.NODE_ENV || "development"; 
const PORT = process.env.PORT || 8001;
const playerList = {};

app.use(express.static(path.join(__dirname, '../public')));

// app.get('/', function (req, res) {
//   res.sendFile(path.join(__dirname, '../index.html'));
//   console.log("In API server.");
// });

io.on('connect', (socket) => {
  console.log((new Date().toISOString()) + ' ID ' + socket.id);

  socket.on('player', (socketID, fn) => {
    //check socketID = socket.id
    playerList[socket.id] = {
      player_id: socket.id,
      boards: null,
      ships: null,
      turn: null
    };
    console.log("Confirmed player from client in server");

    return initiateGame(socket.id);
  });

  socket.on('gameFeed', (data) => {
    console.log("Received new gameState from client in server:", data);
    //if right player's turn
    //update the board
    //ask for a move
    //send shot with full game data
  });

  socket.on('shotFeed', (feed) => {
    sendShot(feed);
    console.log("Received feed from test page in server:", feed);
  });



}); // end of io.on wrapping all socket listeners

function getShot(socketID) {

};

// Sending a shot to the client
function sendShot(target) {
  socket.emit('serverFeed', target, (req, res) => {
    console.log("Does emit has a callback?", req, " and ", res);
  });
};

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT} in ${ENV} mode.`);
});