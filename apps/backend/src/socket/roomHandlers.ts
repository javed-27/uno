/**
 * Socket event handlers for rooms and game management.
 */

import { Server } from "socket.io";
import {
  ClientToServerEvents,
  GameStartedData,
  LeaveRoomData,
  PlayCardData,
  RoomCreatedData,
  RoomJoinedData,
  RoomPublicState,
  RoomUpdatedData,
  ServerToClientEvents,
  TypedSocket,
} from "../types";
import { RoomManager } from "../rooms/RoomManager";
import { logger } from "../logger";

export function registerRoomHandlers(
  io: Server<ClientToServerEvents, ServerToClientEvents>,
  socket: TypedSocket,
  roomManager: RoomManager,
) {
  const emitRoomUpdateForSocket = (roomId: string, playerId?: string) => {
    const publicRoom = roomManager.getPublicRoomState(roomId, playerId);
    if (!publicRoom) return;
    socket.emit("ROOM_UPDATED", { room: publicRoom });
  };

  const broadcastRoomUpdate = (roomId: string) => {
    const room = roomManager.getRoom(roomId);
    if (!room) return;

    for (const client of io.sockets.sockets.values()) {
      if (client.rooms.has(roomId)) {
        const publicRoom = roomManager.getPublicRoomState(
          roomId,
          client.data.playerId,
        );
        if (publicRoom) {
          client.emit("ROOM_UPDATED", { room: publicRoom });
        }
      }
    }
  };

  const scheduleRoomTimer = (roomId: string) => {
    roomManager.scheduleTurnTimer(roomId, (updatedRoom) => {
      broadcastRoomUpdate(roomId);
      if (updatedRoom.gameState === "in-progress") {
        scheduleRoomTimer(roomId);
      }
    });
  };

  socket.on("CREATE_ROOM", (data, callback) => {
    const playerId = socket.data.playerId;
    if (!playerId) {
      callback("Socket missing playerId");
      return;
    }

    const room = roomManager.createRoom(playerId, data.playerName, socket.id);
    socket.data.roomId = room.roomId;
    socket.join(room.roomId);

    const response: RoomCreatedData = {
      roomId: room.roomId,
      roomCode: room.roomCode,
      hostId: room.hostId,
      room: roomManager.getPublicRoomState(
        room.roomId,
        playerId,
      ) as RoomPublicState,
    };

    callback(undefined, response);
  });

  socket.on("JOIN_ROOM", (data, callback) => {
    const playerId = socket.data.playerId;
    if (!playerId) {
      callback("Socket missing playerId");
      return;
    }

    const room = roomManager.getRoomByCode(data.roomCode);
    if (!room) {
      callback("Room not found");
      return;
    }

    const player = {
      id: playerId,
      name: data.playerName,
      socketId: socket.id,
      hand: [],
      hasCalledUno: false,
      isConnected: true,
    };

    if (!roomManager.addPlayerToRoom(room.roomId, player)) {
      callback("Unable to join room");
      return;
    }

    socket.data.roomId = room.roomId;
    socket.join(room.roomId);

    const response: RoomJoinedData = {
      room: roomManager.getPublicRoomState(
        room.roomId,
        playerId,
      ) as RoomPublicState,
    };

    broadcastRoomUpdate(room.roomId);
    callback(undefined, response);
  });

  socket.on("LEAVE_ROOM", (data: LeaveRoomData, callback) => {
    const playerId = socket.data.playerId;
    if (!playerId) {
      callback("Socket missing playerId");
      return;
    }

    const room = roomManager.getRoom(data.roomId);
    if (!room) {
      callback("Room not found");
      return;
    }

    roomManager.removePlayerFromRoom(room.roomId, playerId);
    socket.leave(room.roomId);
    callback(undefined);
    broadcastRoomUpdate(room.roomId);
  });

  socket.on("START_GAME", (data, callback) => {
    const playerId = socket.data.playerId;
    if (!playerId) {
      callback("Socket missing playerId");
      return;
    }

    const room = roomManager.getRoom(data.roomId);
    if (!room) {
      callback("Room not found");
      return;
    }

    const started = roomManager.startGame(data.roomId, playerId);
    if (!started) {
      callback("Unable to start game");
      return;
    }

    broadcastRoomUpdate(data.roomId);
    scheduleRoomTimer(data.roomId);

    for (const client of io.sockets.sockets.values()) {
      if (client.rooms.has(data.roomId)) {
        const publicRoom = roomManager.getPublicRoomState(
          data.roomId,
          client.data.playerId,
        );
        if (publicRoom) {
          client.emit("GAME_STARTED", { room: publicRoom });
        }
      }
    }

    callback(undefined);
  });

  socket.on("PLAY_CARD", (data: PlayCardData, callback) => {
    const playerId = socket.data.playerId;
    if (!playerId) {
      callback("Socket missing playerId");
      return;
    }

    const room = roomManager.playCard(
      data.roomId,
      playerId,
      data.cardId,
      data.chosenColor,
    );
    if (!room) {
      callback("Unable to play card");
      return;
    }

    broadcastRoomUpdate(data.roomId);

    if (room.gameState === "finished") {
      for (const client of io.sockets.sockets.values()) {
        if (client.rooms.has(data.roomId)) {
          const publicRoom = roomManager.getPublicRoomState(
            data.roomId,
            client.data.playerId,
          );
          if (publicRoom) {
            client.emit("GAME_FINISHED", { room: publicRoom });
          }
        }
      }
    } else {
      scheduleRoomTimer(data.roomId);
    }

    callback(undefined);
  });

  socket.on("DRAW_CARD", (data: { roomId: string }, callback) => {
    const playerId = socket.data.playerId;
    if (!playerId) {
      callback("Socket missing playerId");
      return;
    }

    const room = roomManager.drawCard(data.roomId, playerId);
    if (!room) {
      callback("Unable to draw card");
      return;
    }

    broadcastRoomUpdate(data.roomId);
    if (room.gameState === "in-progress") {
      scheduleRoomTimer(data.roomId);
    }
    callback(undefined);
  });

  socket.on("CALL_UNO", (data: { roomId: string }, callback) => {
    const playerId = socket.data.playerId;
    if (!playerId) {
      callback("Socket missing playerId");
      return;
    }

    const room = roomManager.callUno(data.roomId, playerId);
    if (!room) {
      callback("Unable to call UNO");
      return;
    }

    broadcastRoomUpdate(data.roomId);
    callback(undefined);
  });

  socket.on("TEST", (data, callback) => {
    logger.debug("Received test event", { data });
    callback(undefined);
  });
}
