import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import io, { Socket } from "socket.io-client";

export const UNO_COLORS = ["red", "green", "blue", "yellow"] as const;
export type UnoColor = (typeof UNO_COLORS)[number] | "wild";
export type UnoValue =
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | "skip"
  | "reverse"
  | "draw2"
  | "wild"
  | "wild_draw4";

export interface UnoCard {
  id: string;
  color: UnoColor;
  value: UnoValue;
}

export interface PublicPlayer {
  id: string;
  name: string;
  isHost: boolean;
  cardCount: number;
  hasCalledUno: boolean;
  isConnected: boolean;
}

export interface GameState {
  deck: UnoCard[];
  discardPile: UnoCard[];
  currentCard: UnoCard;
  currentColor: Exclude<UnoColor, "wild">;
  direction: 1 | -1;
  currentPlayerId: string;
  pendingDrawCount: number;
  pendingDrawType: "draw2" | "wild_draw4" | null;
  pendingUnoPlayerId: string | null;
}

export type RoomGameState = "waiting" | "in-progress" | "finished";

export interface RoomState {
  roomId: string;
  roomCode: string;
  hostId: string;
  players: PublicPlayer[];
  gameState: RoomGameState;
  game?: GameState;
  winnerId?: string;
  timerExpiresAt?: number | null;
  yourHand: UnoCard[];
}

interface CreateRoomData {
  playerName: string;
}

interface JoinRoomData {
  roomCode: string;
  playerName: string;
}

interface PlayCardData {
  roomId: string;
  cardId: string;
  chosenColor?: Exclude<UnoColor, "wild">;
}

interface DrawCardData {
  roomId: string;
}

interface CallUnoData {
  roomId: string;
}

interface RoomCreatedData {
  roomId: string;
  roomCode: string;
  hostId: string;
  room: RoomState;
}

interface RoomJoinedData {
  room: RoomState;
}

interface RoomUpdatedData {
  room: RoomState;
}

interface GameStartedData {
  room: RoomState;
}

interface GameFinishedData {
  room: RoomState;
}

interface ErrorData {
  message: string;
}

interface ClientToServerEvents {
  CREATE_ROOM: (
    data: CreateRoomData,
    callback: (error?: string, data?: RoomCreatedData) => void,
  ) => void;
  JOIN_ROOM: (
    data: JoinRoomData,
    callback: (error?: string, data?: RoomJoinedData) => void,
  ) => void;
  LEAVE_ROOM: (data: DrawCardData, callback: (error?: string) => void) => void;
  START_GAME: (
    data: { roomId: string },
    callback: (error?: string) => void,
  ) => void;
  PLAY_CARD: (data: PlayCardData, callback: (error?: string) => void) => void;
  DRAW_CARD: (data: DrawCardData, callback: (error?: string) => void) => void;
  CALL_UNO: (data: CallUnoData, callback: (error?: string) => void) => void;
  TEST: (data: unknown, callback: (error?: string) => void) => void;
}

interface ServerToClientEvents {
  ROOM_CREATED: (data: RoomCreatedData) => void;
  ROOM_JOINED: (data: RoomJoinedData) => void;
  ROOM_UPDATED: (data: RoomUpdatedData) => void;
  GAME_STARTED: (data: GameStartedData) => void;
  GAME_FINISHED: (data: GameFinishedData) => void;
  ERROR: (data: ErrorData) => void;
}

interface SocketContextType {
  socket: Socket<ServerToClientEvents, ClientToServerEvents> | null;
  isConnected: boolean;
  playerId: string | null;
  room: RoomState | null;
  error: string | null;
  createRoom: (playerName: string) => Promise<void>;
  joinRoom: (roomCode: string, playerName: string) => Promise<void>;
  leaveRoom: () => Promise<void>;
  startGame: () => Promise<void>;
  playCard: (
    cardId: string,
    chosenColor?: Exclude<UnoColor, "wild">,
  ) => Promise<void>;
  drawCard: () => Promise<void>;
  callUno: () => Promise<void>;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within SocketProvider");
  }
  return context;
}

interface SocketProviderProps {
  children: React.ReactNode;
}

export function SocketProvider({ children }: SocketProviderProps) {
  const navigate = useNavigate();
  const [socket, setSocket] = useState<
    Socket<ServerToClientEvents, ClientToServerEvents> | null
  >(null);
  const [isConnected, setIsConnected] = useState(false);
  const [room, setRoom] = useState<RoomState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [playerId] = useState(() => {
    const stored = localStorage.getItem("playerId");
    if (stored) return stored;

    const generated = `player_${Date.now()}_${
      Math.random().toString(36).slice(2, 9)
    }`;
    localStorage.setItem("playerId", generated);
    return generated;
  });

  useEffect(() => {
    const socketUrl = import.meta.env.VITE_SOCKET_URL ||
      "http://localhost:4000";
    const sessionId = localStorage.getItem("sessionId") ||
      `session_${Date.now()}`;

    localStorage.setItem("sessionId", sessionId);

    const newSocket = io<ServerToClientEvents, ClientToServerEvents>(
      socketUrl,
      {
        query: { playerId, sessionId },
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 10,
      },
    );

    newSocket.on("connect", () => {
      setIsConnected(true);
      setError(null);
    });

    newSocket.on("disconnect", () => {
      setIsConnected(false);
    });

    newSocket.on("ERROR", (data) => {
      setError(data.message);
    });

    newSocket.on("ROOM_CREATED", (data) => {
      setRoom(data.room);
      navigate(`/lobby/${data.room.roomCode}`);
    });

    newSocket.on("ROOM_JOINED", (data) => {
      setRoom(data.room);
      navigate(`/lobby/${data.room.roomCode}`);
    });

    newSocket.on("ROOM_UPDATED", (data) => {
      setRoom(data.room);
    });

    newSocket.on("GAME_STARTED", (data) => {
      setRoom(data.room);
      navigate(`/game/${data.room.roomCode}`);
    });

    newSocket.on("GAME_FINISHED", (data) => {
      setRoom(data.room);
      navigate(`/win/${data.room.roomCode}`);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [navigate, playerId]);

  const createRoom = (playerName: string) =>
    new Promise<void>((resolve, reject) => {
      if (!socket) {
        reject("Socket is not connected");
        return;
      }

      socket.emit("CREATE_ROOM", { playerName }, (error) => {
        if (error) {
          setError(error);
          reject(error);
          return;
        }
        resolve();
      });
    });

  const joinRoom = (roomCode: string, playerName: string) =>
    new Promise<void>((resolve, reject) => {
      if (!socket) {
        reject("Socket is not connected");
        return;
      }

      socket.emit("JOIN_ROOM", { roomCode, playerName }, (error) => {
        if (error) {
          setError(error);
          reject(error);
          return;
        }

        resolve();
      });
    });

  const leaveRoom = () =>
    new Promise<void>((resolve, reject) => {
      if (!socket || !room) {
        reject("Unable to leave room");
        return;
      }

      socket.emit("LEAVE_ROOM", { roomId: room.roomId }, (error) => {
        if (error) {
          setError(error);
          reject(error);
          return;
        }

        setRoom(null);
        navigate("/");
        resolve();
      });
    });

  const startGame = () =>
    new Promise<void>((resolve, reject) => {
      if (!socket || !room) {
        reject("Unable to start game");
        return;
      }

      socket.emit("START_GAME", { roomId: room.roomId }, (error) => {
        if (error) {
          setError(error);
          reject(error);
          return;
        }

        resolve();
      });
    });

  const playCard = (
    cardId: string,
    chosenColor?: Exclude<UnoColor, "wild">,
  ) =>
    new Promise<void>((resolve, reject) => {
      if (!socket || !room) {
        reject("Unable to play card");
        return;
      }

      socket.emit(
        "PLAY_CARD",
        { roomId: room.roomId, cardId, chosenColor },
        (error) => {
          if (error) {
            setError(error);
            reject(error);
            return;
          }

          resolve();
        },
      );
    });

  const drawCard = () =>
    new Promise<void>((resolve, reject) => {
      if (!socket || !room) {
        reject("Unable to draw card");
        return;
      }

      socket.emit("DRAW_CARD", { roomId: room.roomId }, (error) => {
        if (error) {
          setError(error);
          reject(error);
          return;
        }

        resolve();
      });
    });

  const callUno = () =>
    new Promise<void>((resolve, reject) => {
      if (!socket || !room) {
        reject("Unable to call UNO");
        return;
      }

      socket.emit("CALL_UNO", { roomId: room.roomId }, (error) => {
        if (error) {
          setError(error);
          reject(error);
          return;
        }

        resolve();
      });
    });

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        playerId,
        room,
        error,
        createRoom,
        joinRoom,
        leaveRoom,
        startGame,
        playCard,
        drawCard,
        callUno,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}
