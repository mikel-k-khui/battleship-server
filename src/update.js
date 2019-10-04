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
            row: '',
            col: ''
          }
        }
*/

/**
 * Return the new gameState to updatethe game state
 * @socketId {socket} socket.
 * @return {gameState}
 */

function updateBoard(hit, gameState, knownShots, randomShots) {
  console.log(game)
  //add player shot to board

  //check if boat is hit or sunk

  //determine shot by level
  console.log("In updateBoard");
  return ({gameState, knownShots, randomShots, serverShot});
};

module.exports = { updateBoard };

function distributeShips(spotsOccupiedObj) {
  let shipsArray = [];

  while (shipsArray.length < 5) {
    let ship = {
      // assign random spot
      row: Object.keys(rowNumbers)[randomRow()],
      col:
        rowNumbers[
          Object.keys(rowNumbers)[randomRow()]
        ],
      size: 2,
      sunk: false,
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

function ShipLocationIsValid (ship, spotsOccupiedObj) {
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

occupySpots = function(ship, spotsOccupiedObj) {

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

nextChar = (c) => String.fromCharCode(c.charCodeAt(0) + 1);

randomRow = () => Math.floor(Math.random() * Object.keys(rowNumbers).length);
