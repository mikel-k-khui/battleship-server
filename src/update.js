const { getAShot } = require('./shots');

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

const updateOpponent = function(hit, gameState, knownShots, randomShots) {
  console.log('Before update:', gameState.turn, ' and ', hit);
  const serverShot = {};

  //add player shot to opponent/server board
  gameState.shots.opponent[hit.row][Number(hit.col) - 1] = 1;

  //check if boat exists then update opponent/server boat is hit or sunk
  if (gameState.boards.opponent[hit.row][Number(hit.col) - 1] === 1) {
    //boat exists, check hit or sunk
    for (const ship of gameState.ships.opponent) {
      if (ship.row === hit.row && ship.col === hit.col) {
        //if ship was hit, then sink it or hit it
        ship.hit ? !ship.sunk : !ship.hit;
      }
    }
  }
  console.log(
    `After updateBoard player `,
    gameState.turn,
    '\nplayer:\n',
    gameState.shots.own,
    '\nopponent/server\n',
    gameState.shots.opponent
  );
};

const updatePlayer = function(hit, gameState, knownShots, randomShots) {
  //add player shot to opponent/server board
  gameState.shots.own[hit.row][Number(hit.col) - 1] = 1;

  //check if boat exists then update opponent/server boat is hit or sunk
  if (gameState.boards.own[hit.row][Number(hit.col) - 1] === 1) {
    //boat exists, check hit or sunk
    for (const ship of gameState.ships.own) {
      if (ship.row === hit.row && ship.col === hit.col) {
        //if ship was hit, then sink it or hit it
        ship.hit ? !ship.sunk : !ship.hit;
      }
    }
  }
  console.log(
    `After updateBoard player `,
    gameState.turn,
    '\nplayer:\n',
    gameState.shots.opponent,
    '\nopponent/server\n',
    gameState.shots.own
  );
};

module.exports = { updateOpponent, updatePlayer };
