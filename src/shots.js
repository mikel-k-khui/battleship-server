const rowNumbers = {
  a: 1,
  b: 2,
  c: 3,
  d: 4,
  e: 5,
  f: 6
};
const EASY = 'EASY';
const INTERMEDIATE = 'INTERMEDIATE';
const DIFFICULT = 'DIFFICULT';
const differentials = {
  EASY: Number(0.6),
  INTERMEDIATE: Number(0.9),
  DIFFICULT: Number(1.2)
};
/*
gameState: {
  player_id: 'sample1',
  shots: { own: { a: [0,0,0,0,0,0], ... },
           opponent: { a: [0,0,0,0,0,0], ... }
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
 * Render an array of shots to be sent to client
 * @gameState {object} the board after it was initialized.
 * @return { [array], [array] } one array of random shots, one array of known shots
 */
function getShotsArray(gameState) {
  // console.log("Pre-randomize Ships:", gameState.ships.own);
  // console.log("Pre-randomize Board:", gameState.boards.own);
  // console.log(gameState);

  let knownShots = [];
  let randomShots = [];

  for (const row in gameState.boards.own) {
    for (const col in gameState.boards.own[row]) {
      if (gameState.boards.own[row][col] === 1) {
        knownShots.push({ 'row': row, 'col': Number(col) + 1});
      } else {
        randomShots.push({ 'row': row, 'col': Number(col) + 1});
      }
    }
  }
  
  knownShots = randomizeShots(knownShots.slice());
  randomShots = randomizeShots(randomShots.slice());

  // console.log('Random array:', randomShots);
  // console.log('Known shots', knownShots);

  return { randomShots, knownShots };
};

/**
 * Render an array of shots to be sent to client
 * @gameState {object} the board after it was initialized.
 * @return [array]
 */
function getAShot(gameState, level, knownShots, randomShots, socketID = '') {
  console.log("Get a shot", knownShots);
  const chance = Math.random() * differentials[level];
  return ( knownShots.length !== 0 && chance > 0.5  ? knownShots.pop() : randomShots.pop() );
};

module.exports = { getAShot, getShotsArray, EASY, INTERMEDIATE, DIFFICULT };

randomizeShots = function(array) {
  let randomized = [];
  let pos = 0;
  let shot = {};
  let moves = array.slice();
  let count = 0;

  while (moves.length > 0 && count < array.length) {
    // generate a position of the array randomly
    // slice the array by position
    // concat the array before (min. is [] per pos = 1)
    // with the array after (max. is [] where length of array)
    // push the object in the position to the array

    pos = Math.max(1, Math.floor(Math.random() * moves.length + 1));
    shot = moves.slice(pos - 1, pos);
    moves = moves.slice(0, pos - 1).concat(moves.slice(pos, moves.length));
    randomized.push(shot[0]);
    // console.log('While:', shot);
    count += 1;
  }

  return randomized;
};