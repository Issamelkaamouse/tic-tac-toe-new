import { Game } from "./Game";
import { Player } from "./Player";

export interface Room {
    roomId: string;            // Unique identifier for the room
    player1: Player;           // Player 1 (initiator of the game)
    player2?: Player;          // Player 2 (optional until they join)
    status: 'waiting' | 'active' | 'completed'; // Room status to manage the game flow
    game: Game | null;         // Associated game data or null if no game has started
    createdAt: Date;           // Date the room was created
    updatedAt: Date;           // Last update to the room (useful for detecting activity)
  }