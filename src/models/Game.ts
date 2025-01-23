// models/game.model.ts
export interface Game {
  roomId: string;           // The room ID associated with the game
  board: string[][];        // The 3x3 Tic Tac Toe grid (array of 'X', 'O', or '')
  currentPlayer: string;    // The player who is currently making a move
  winner?: string | null;   // The winner of the game ('X', 'O', or null if no winner)
  moves: string[];          // List of moves made in the game
  createdAt: Date;          // Date the game started
}
