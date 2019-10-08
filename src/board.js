const rowNumbers = {
  a: 1,
  b: 2,
  c: 3,
  d: 4,
  e: 5,
  f: 6
};

/*
gameState: {
  player_id: 'sample1',
  shots: { own: { a: [0,0,0,0,0,1], ... },
           opponent: { a: [1,0,0,0,0,0], ... }
        },
  boards: { own: { a: [0,0,0,0,0,1], ... },
            opponent: { a: [1,0,0,0,0,0], ... }
          },
  ships:  { own:[ { row: 'a', col: 4, size: 2, sunk: false, horizontal: true}, ...],
            opponent: [ { row: 'a', col: 4, size: 2, sunk: false, horizontal: true}, ...]
          },
  turn:   { player: 'server',
            shot: {
              row: '',
              col: ''
            }
          },
  endgame:{ gameOver: boolean,
            winner: 'player' or 'opponent'
          }
        }
*/

/**
 * Return the gameState to initiate the game
 * @socketId {socket} socket.
 * @return {gameState}
 */

const initGameBoards = function(socketId) {
  // Create deep copies of the game board of the sampleboard will get overwritten
  const playerCleanBoard = {
    a: [0, 0, 0, 0, 0, 0],
    b: [0, 0, 0, 0, 0, 0],
    c: [0, 0, 0, 0, 0, 0],
    d: [0, 0, 0, 0, 0, 0],
    e: [0, 0, 0, 0, 0, 0],
    f: [0, 0, 0, 0, 0, 0]
  };
  const opponentCleanBoard = {
    a: [0, 0, 0, 0, 0, 0],
    b: [0, 0, 0, 0, 0, 0],
    c: [0, 0, 0, 0, 0, 0],
    d: [0, 0, 0, 0, 0, 0],
    e: [0, 0, 0, 0, 0, 0],
    f: [0, 0, 0, 0, 0, 0]
  };
  const playerSpotsOccupied = {
    a: [0, 0, 0, 0, 0, 0],
    b: [0, 0, 0, 0, 0, 0],
    c: [0, 0, 0, 0, 0, 0],
    d: [0, 0, 0, 0, 0, 0],
    e: [0, 0, 0, 0, 0, 0],
    f: [0, 0, 0, 0, 0, 0]
  };
  const opponentSpotsOccupied = {
    a: [0, 0, 0, 0, 0, 0],
    b: [0, 0, 0, 0, 0, 0],
    c: [0, 0, 0, 0, 0, 0],
    d: [0, 0, 0, 0, 0, 0],
    e: [0, 0, 0, 0, 0, 0],
    f: [0, 0, 0, 0, 0, 0]
  };

  let player = distributeShips(playerSpotsOccupied);
  // console.log(`initGameBoards of board.js - player${socketId}:\n`, playerCleanBoard, "\n", player['spotsOccupiedObj']);

  let opponent = distributeShips(opponentSpotsOccupied);
  // console.log('initGameBoards of board.js - opponent:\n', opponentCleanBoard, "\n", opponent['spotsOccupiedObj']);

  return {
    player_id: socketId,
    shots: { own: playerCleanBoard, opponent: opponentCleanBoard },
    boards: {
      own: player['spotsOccupiedObj'],
      opponent: opponent['spotsOccupiedObj']
    },
    ships: { own: player['shipsArray'], opponent: opponent['shipsArray'] },
    turn: { player: 'server', shot: { row: '', col: 0, hit: false } },
    endGame: { gameOver: false, kraken: false, winner: null }
  };
};

module.exports = { initGameBoards };

const distributeShips = function(spotsOccupiedObj) {
  let shipsArray = [];

  while (shipsArray.length < 5) {
    let ship = {
      // assign random spot
      row: Object.keys(rowNumbers)[randomRow()],
      col: rowNumbers[Object.keys(rowNumbers)[randomRow()]],
      size: 2,
      sunk: false,
      hit: false,
      horizontal: Math.random() >= 0.5 // true or false
    };

    if (ShipLocationIsValid(ship, spotsOccupiedObj)) {
      // now verify that the proposed location is in fact valid, AND NOT OVERLAPPING EXISTING SHIP!
      shipsArray.push(ship);
      occupySpots(ship, spotsOccupiedObj);
    }
  }
  // console.log("the Board:", spotsOccupiedObj);
  return { shipsArray, spotsOccupiedObj };
};

const ShipLocationIsValid = function(ship, spotsOccupiedObj) {
  if (ship.col === 6 && ship.horizontal === true) {
    return false;
  }
  // ship cannot start in 6th row and be vertical
  if (ship.row === 'f' && ship.horizontal === false) {
    return false;
  }
  if (ship.horizontal) {
    if (
      spotsOccupiedObj[ship.row][ship.col - 1] === 1 ||
      spotsOccupiedObj[ship.row][ship.col] === 1
    ) {
      return false; // ship cannot overlap an existing boat
    }
  } else {
    // ship is vertical
    if (
      spotsOccupiedObj[ship.row][ship.col - 1] === 1 ||
      spotsOccupiedObj[nextChar(ship.row)][ship.col - 1] === 1
    ) {
      return false; // ship cannot overlap an existing boat
    }
  }
  // console.log('Validate location?');
  return true;
};

const occupySpots = function(ship, spotsOccupiedObj) {
  if (ship.horizontal) {
    spotsOccupiedObj[ship.row][ship.col - 1] = 1;
    spotsOccupiedObj[ship.row][ship.col] = 1;
  } else {
    //if ship is vertical
    spotsOccupiedObj[ship.row][ship.col - 1] = 1;
    spotsOccupiedObj[nextChar(ship.row)][ship.col - 1] = 1;
  }
  // console.log('After occupySpots in board.js:');
  return spotsOccupiedObj;
};

const nextChar = c => String.fromCharCode(c.charCodeAt(0) + 1);

const randomRow = () =>
  Math.floor(Math.random() * Object.keys(rowNumbers).length);
