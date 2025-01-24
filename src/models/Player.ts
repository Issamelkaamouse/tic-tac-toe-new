export interface Player {
  id: string;            // Unique ID of the player (could be generated, Firebase ID, etc.)
  name: string;          // Name of the player
  symbol: 'X' | 'O';     // The symbol they use in the game (either 'X' or 'O')
  joinedAt?: Date;       // Optional: When the player joined the game (for tracking)
}
