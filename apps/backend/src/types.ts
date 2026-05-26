/**
 * Typed Socket.IO interfaces (Phase 4 will expand these)
 * For now: basic structure with event contracts
 */

import { Socket as SocketIOSocket } from "socket.io";

/**
 * Client-to-Server event payloads
 */
export interface ClientToServerEvents {
  CREATE_ROOM: (
    data: CreateRoomData,
    callback: (error?: string, roomId?: string) => void,
  ) => void;
  JOIN_ROOM: (data: JoinRoomData, callback: (error?: string) => void) => void;
  LEAVE_ROOM: (data: LeaveRoomData, callback: (error?: string) => void) => void;
}

/**
 * Server-to-Client event payloads
 */
export interface ServerToClientEvents {
  ROOM_CREATED: (data: RoomCreatedData) => void;
  ROOM_JOINED: (data: RoomJoinedData) => void;
  ERROR: (data: ErrorData) => void;
}

/**
 * Socket instance with typed events
 */
export type TypedSocket = SocketIOSocket<
  ClientToServerEvents,
  ServerToClientEvents
>;

/**
 * Event payload types
 */
export interface CreateRoomData {
  playerName: string;
}

export interface RoomCreatedData {
  roomId: string;
  roomCode: string;
  hostId: string;
}

export interface JoinRoomData {
  roomCode: string;
  playerName: string;
}

export interface RoomJoinedData {
  roomId: string;
  playerId: string;
  players: string[];
}

export interface LeaveRoomData {
  roomId: string;
}

export interface ErrorData {
  message: string;
}
