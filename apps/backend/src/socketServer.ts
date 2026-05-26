import { Server as HttpServer } from "http";
import { Server } from "socket.io";
import { TypedSocket } from "./types";
import { socketAuthMiddleware } from "./middleware/socketAuth";
import { RoomManager } from "./rooms/RoomManager";
import { PlayerManager } from "./rooms/PlayerManager";
import { logger } from "./logger";
import { config } from "./config";

// Initialize managers (will be extended in Phase 5)
const roomManager = new RoomManager();
const globalPlayerManager = new PlayerManager();

export function createSocketServer(httpServer: HttpServer) {
  const io = new Server(httpServer, {
    cors: config.cors,
  });

  // Authentication middleware
  io.use((socket, next) => {
    socketAuthMiddleware(socket as any, next);
  });

  // Connection handler
  io.on("connection", (socket: TypedSocket) => {
    logger.info("Client connected", {
      socketId: socket.id,
      playerId: (socket as any).playerId,
    });

    // Disconnect handler
    socket.on("disconnect", () => {
      logger.info("Client disconnected", { socketId: socket.id });
    });

    // Basic echo event for testing
    socket.on("test", (data: unknown) => {
      logger.debug("Received test event", { data });
      socket.emit("test", { echo: data });
    });
  });

  return io;
}
