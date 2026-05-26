/**
 * Player management utilities
 */

import { Player } from "../types";

export class PlayerManager {
  private players = new Map<string, Player>();

  addPlayer(id: string, name: string, socketId: string): Player {
    const player: Player = {
      id,
      name,
      socketId,
      hand: [],
      hasCalledUno: false,
      isConnected: true,
    };
    this.players.set(id, player);
    return player;
  }

  getPlayer(id: string): Player | undefined {
    return this.players.get(id);
  }

  getPlayerBySocketId(socketId: string): Player | undefined {
    return Array.from(this.players.values()).find((p) =>
      p.socketId === socketId
    );
  }

  removePlayer(id: string): boolean {
    return this.players.delete(id);
  }

  updatePlayerSocket(id: string, socketId: string): boolean {
    const player = this.players.get(id);
    if (!player) return false;
    player.socketId = socketId;
    return true;
  }

  getAllPlayers(): Player[] {
    return Array.from(this.players.values());
  }

  clear(): void {
    this.players.clear();
  }
}
