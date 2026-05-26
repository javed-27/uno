import { Socket as SocketIOSocket } from "socket.io";
import { UnoCard, UnoGameState } from "./game-engine/uno";

export type RoomGameState = "waiting" | "in-progress" | "finished";

export interface Player {
  id: string;
  name: string;
  socketId: string;
  hand: UnoCard[];
  hasCalledUno: boolean;
  isConnected: boolean;
}

export interface PublicPlayer {
  id: string;
  name: string;
  isHost: boolean;
  cardCount: number;
  hasCalledUno: boolean;
  isConnected: boolean;
}

export interface RoomState {
  roomId: string;
  roomCode: string;
  hostId: string;
  players: Player[];
  gameState: RoomGameState;
  game?: UnoGameState;
  winnerId?: string;
  timerExpiresAt?: number | null;
}

export interface RoomPublicState {
  roomId: string;
  roomCode: string;
  hostId: string;
  players: PublicPlayer[];
  gameState: RoomGameState;
  game?: UnoGameState;
  winnerId?: string;
  timerExpiresAt?: number | null;
  yourHand: UnoCard[];
}

export interface CreateRoomData {
  playerName: string;
}

export interface JoinRoomData {
  roomCode: string;
  playerName: string;
}

export interface PlayCardData {
  roomId: string;
  cardId: string;
  chosenColor?: Exclude<UnoCard["color"], "wild">;
}

export interface DrawCardData {
  roomId: string;
}

export interface CallUnoData {
  roomId: string;
}

export interface LeaveRoomData {
  roomId: string;
}

export interface RoomCreatedData {
  roomId: string;
  roomCode: string;
  hostId: string;
  room: RoomPublicState;
}

export interface RoomJoinedData {
  room: RoomPublicState;
}

export interface RoomUpdatedData {
  room: RoomPublicState;
}

export interface GameStartedData {
  room: RoomPublicState;
}

export interface GameFinishedData {
  room: RoomPublicState;
}

export interface ErrorData {
  message: string;
}

export interface ClientToServerEvents {
  CREATE_ROOM: (
    data: CreateRoomData,
    callback: (error?: string, data?: RoomCreatedData) => void,
  ) => void;
  JOIN_ROOM: (
    data: JoinRoomData,
    callback: (error?: string, data?: RoomJoinedData) => void,
  ) => void;
  LEAVE_ROOM: (data: LeaveRoomData, callback: (error?: string) => void) => void;
  START_GAME: (
    data: { roomId: string },
    callback: (error?: string) => void,
  ) => void;
  PLAY_CARD: (data: PlayCardData, callback: (error?: string) => void) => void;
  DRAW_CARD: (data: DrawCardData, callback: (error?: string) => void) => void;
  CALL_UNO: (data: CallUnoData, callback: (error?: string) => void) => void;
  TEST: (data: unknown, callback: (error?: string) => void) => void;
}

export interface ServerToClientEvents {
  ROOM_CREATED: (data: RoomCreatedData) => void;
  ROOM_JOINED: (data: RoomJoinedData) => void;
  ROOM_UPDATED: (data: RoomUpdatedData) => void;
  GAME_STARTED: (data: GameStartedData) => void;
  GAME_FINISHED: (data: GameFinishedData) => void;
  ERROR: (data: ErrorData) => void;
}

export interface AuthSocketData {
  playerId?: string;
  sessionId?: string;
  roomId?: string;
}

export type TypedSocket = SocketIOSocket<
  ClientToServerEvents,
  ServerToClientEvents,
  Record<string, unknown>,
  AuthSocketData
>;
