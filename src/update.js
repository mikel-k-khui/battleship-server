const { getAShot } = require('./shots');

const rowNumbers = {
  a: 1,
  b: 2,
  c: 3,
  d: 4,
  e: 5,
  f: 6
};

const nextChar = function(c) {
  return String.fromCharCode(c.charCodeAt(0) + 1);
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
  endGame:{ gameOver: boolean,
            winner: 'player' or 'opponent'
          }
        }
*/

/**
 * Return the new gameState to updatethe game state
 * @socketId {socket} socket.
 * @return {gameState}
 */

const updateOpponent = function(hit, gameState, knownShots, randomShots) {
  // console.log('Before update:', gameState.turn, ' and ', hit);
  const serverShot = {};
  let boatsSunk = 0;

  //add player shot to opponent/server board
  gameState.shots.opponent[hit.row][Number(hit.col) - 1] = 1;

  //check if boat exists then update opponent/server boat is hit or sunk
  // if (gameState.boards.opponent[hit.row][Number(hit.col) - 1] === 1) {
  //boat exists, check hit or sunk, does not update HIT status as we don't see this as a player
  for (const ship of gameState.ships.opponent) {
    if (ship.horizontal) {
      if (
        (ship.row === hit.row && ship.col === hit.col) ||
        (ship.row === hit.row && ship.col + 1 === hit.col)
      ) {
        // if ship is hit
        ship.hit = true;
      }
      if (
        gameState.shots.opponent[ship.row][ship.col - 1] === 1 &&
        gameState.shots.opponent[ship.row][ship.col] === 1
      ) {
        ship.sunk = true;
        boatsSunk++;
      }
    } else {
      // ship is vertical
      if (
        (ship.row === hit.row && ship.col === hit.col) ||
        (nextChar(ship.row) === hit.row && ship.col === hit.col)
      ) {
        //if ship was hit
        ship.hit = true;
      }
      if (
        gameState.shots.opponent[ship.row][ship.col - 1] === 1 &&
        gameState.shots.opponent[nextChar(ship.row)][ship.col - 1] === 1
      ) {
        ship.sunk = true;
        boatsSunk++;
      }
    }
  }
  // }
  // console.log(
  //   `After updateBoard player `,
  //   gameState.turn,
  //   '\nplayer:\n',
  //   gameState.shots.own,
  //   '\nopponent/server\n',
  //   gameState.shots.opponent
  // );
  if (boatsSunk === 5) {
    gameState.endGame.gameOver = true;
    gameState.endGame.winner = 'player';
  }
};

const updatePlayer = function(hit, gameState, knownShots, randomShots) {
  // console.log('Before update player:', gameState.shots.own, ' and ', hit);

  //add player shot to opponent/server board
  gameState.shots.own[hit.row][Number(hit.col) - 1] = 1;
  let boatsSunk = 0;

  //check if boat exists then update opponent/server boat is hit or sunk
  // if (gameState.boards.own[hit.row][Number(hit.col) - 1] === 1) {
  //boat exists, check hit or sunk
  for (const ship of gameState.ships.own) {
    if (ship.horizontal) {
      if (
        (ship.row === hit.row && ship.col === hit.col) ||
        (ship.row === hit.row && ship.col + 1 === hit.col)
      ) {
        // if ship is hit
        ship.hit = true;
      }
      if (
        gameState.shots.own[ship.row][ship.col - 1] === 1 &&
        gameState.shots.own[ship.row][ship.col] === 1
      ) {
        ship.sunk = true;
        boatsSunk++;
      }
    } else {
      // ship is vertical
      if (
        (ship.row === hit.row && ship.col === hit.col) ||
        (nextChar(ship.row) === hit.row && ship.col === hit.col)
      ) {
        //if ship was hit
        ship.hit = true;
      }
      if (
        gameState.shots.own[ship.row][ship.col - 1] === 1 &&
        gameState.shots.own[nextChar(ship.row)][ship.col - 1] === 1
      ) {
        ship.sunk = true;
        boatsSunk++;
      }
    }
  }
  // }
  // console.log(
  //   `After updateBoard player `,
  //   gameState.turn,
  //   '\nplayer:\n',
  //   gameState.shots.opponent,
  //   '\nopponent/server\n',
  //   gameState.shots.own
  // );
  if (boatsSunk === 5) {
    gameState.endGame.gameOver = true;
    gameState.endGame.winner = 'opponent';
  }
};

const updateShot = function(shotOnPlayer, gameState) {
  gameState.turn.shot.hit = false; // reset to false
  gameState.turn.shot.row = shotOnPlayer.row;
  gameState.turn.shot.col = shotOnPlayer.col;

  if (
    gameState.boards.own[shotOnPlayer.row][Number(shotOnPlayer.col) - 1] === 1
  ) {
    gameState.turn.shot.hit = true;
  }
};

module.exports = { updateOpponent, updatePlayer, updateShot };
