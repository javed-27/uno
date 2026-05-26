/**
 * Room management utilities
 */

import { Player, PlayerManager } from "./PlayerManager";

export interface RoomState {
  roomId: string;
  hostId: string;
  players: Player[];
  gameState: "waiting" | "in-progress" | "finished";
  timerState?: Record<string, unknown>;
}

export class RoomManager {
  private rooms = new Map<string, RoomState>();
  private codeToRoomId = new Map<string, string>();

  createRoom(
    roomId: string,
    hostId: string,
    hostName: string,
    hostSocketId: string,
  ): RoomState {
    const playerManager = new PlayerManager();
    playerManager.addPlayer(hostId, hostName, hostSocketId);

    const room: RoomState = {
      roomId,
      hostId,
      players: playerManager.getAllPlayers(),
      gameState: "waiting",
    };

    this.rooms.set(roomId, room);
    return room;
  }

  getRoom(roomId: string): RoomState | undefined {
    return this.rooms.get(roomId);
  }

  deleteRoom(roomId: string): boolean {
    const room = this.rooms.get(roomId);
    if (!room) return false;

    this.rooms.delete(roomId);
    // Clean up code mapping if exists
    Array.from(this.codeToRoomId.entries()).forEach(([code, id]) => {
      if (id === roomId) {
        this.codeToRoomId.delete(code);
      }
    });

    return true;
  }

  mapRoomCode(code: string, roomId: string): void {
    this.codeToRoomId.set(code, roomId);
  }

  getRoomByCode(code: string): RoomState | undefined {
    const roomId = this.codeToRoomId.get(code);
    return roomId ? this.rooms.get(roomId) : undefined;
  }

  addPlayerToRoom(roomId: string, player: Player): boolean {
    const room = this.rooms.get(roomId);
    if (!room) return false;

    // Check if player already in room
    if (room.players.some((p) => p.id === player.id)) {
      return false;
    }

    room.players.push(player);
    return true;
  }

  removePlayerFromRoom(roomId: string, playerId: string): boolean {
    const room = this.rooms.get(roomId);
    if (!room) return false;

    const index = room.players.findIndex((p) => p.id === playerId);
    if (index === -1) return false;

    room.players.splice(index, 1);

    // Transfer host if host left
    if (room.hostId === playerId && room.players.length > 0) {
      room.hostId = room.players[0].id;
    }

    return true;
  }

  getAllRooms(): RoomState[] {
    return Array.from(this.rooms.values());
  }

  updateRoomGameState(
    roomId: string,
    gameState: RoomState["gameState"],
  ): boolean {
    const room = this.rooms.get(roomId);
    if (!room) return false;

    room.gameState = gameState;
    return true;
  }

  clear(): void {
    this.rooms.clear();
    this.codeToRoomId.clear();
  }
}
