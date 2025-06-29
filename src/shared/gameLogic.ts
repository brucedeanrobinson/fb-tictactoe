import type { GameState, Player, EndState, Coords } from './types'

export function createGame(): GameState {
  return {
    id: crypto.randomUUID(),
    board: Array.from({length: 3}, () => Array(3).fill(null)),
    currentPlayer: 'x',
    endState: null
  }
}

export const makeMove = (game: GameState, coords: Coords): GameState => {
  // if clicked square is occupied, return
  // doesn't return a game, but if we care on the client side to give feedback of a bad move then we will implement
  if (game.board[coords.row][coords.col] || game.endState) return game

  // structuredClone the board
  const nextGame = structuredClone(game)
  nextGame.board[coords.row][coords.col] = game.currentPlayer
  
  const nextPlayer: Player = game.currentPlayer === 'x' ? 'o' : 'x'

  return { ...nextGame, currentPlayer: nextPlayer, endState: getEndState(nextGame) }
}

export const getEndState = (game: GameState): EndState => {
  const { board } = game;

  // check wins
  // row
  for (let i = 0; i < 3; i++) {
    const [a, b, c] = board[i]
    if (a && a === b && a === c) return a
  }

  //col
  for (let j = 0; j < 3; j++) {
    const a = board[0][j]
    const b = board[1][j]
    const c = board[2][j]
    if (a && a === b && a === c) return a
  }

  //diagonals
  const center = board[1][1]
  if (center && center === board[0][0] && center === board[2][2]) return center
  if (center && center === board[0][2] && center === board[2][0]) return center

  // check tie (board is full, so there isn't a win which would've been handled above)
  // loop thru every row, checking every cell for non-null
  if (board.every(row => row.every(cell => cell !== null))) return 'tie'

  // else return null
  return null;
}
