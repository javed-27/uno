import { Server as HttpServer } from "http";
import { Server } from "socket.io";
import {
  ClientToServerEvents,
  ServerToClientEvents,
  TypedSocket,
} from "./types";
import { socketAuthMiddleware } from "./middleware/socketAuth";
import { RoomManager } from "./rooms/RoomManager";
import { logger } from "./logger";
import { config } from "./config";
import { registerRoomHandlers } from "./socket/roomHandlers";

const roomManager = new RoomManager();

export function createSocketServer(httpServer: HttpServer) {
  const io = new Server<ClientToServerEvents, ServerToClientEvents>(
    httpServer,
    {
      cors: config.cors,
    },
  );

  io.use((socket, next) => {
    socketAuthMiddleware(socket as any, next);
  });

  io.on("connection", (socket: TypedSocket) => {
    logger.info("Client connected", {
      socketId: socket.id,
      playerId: socket.data.playerId,
    });

    registerRoomHandlers(io, socket, roomManager);

    socket.on("disconnect", () => {
      const roomId = socket.data.roomId;
      const playerId = socket.data.playerId;
      if (roomId && playerId) {
        roomManager.removePlayerFromRoom(roomId, playerId);
        const room = roomManager.getRoom(roomId);
        if (room) {
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
        }
      }

      logger.info("Client disconnected", {
        socketId: socket.id,
        playerId: socket.data.playerId,
      });
    });
  });

  return io;
}
