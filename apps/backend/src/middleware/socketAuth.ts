/**
 * Socket authentication middleware
 */

import { Socket } from "socket.io";
import { logger } from "../logger";

export interface AuthenticatedSocket extends Socket {
  data: {
    playerId?: string;
    sessionId?: string;
    roomId?: string;
  };
}

/**
 * Simple socket authentication middleware
 * In production, validate JWT tokens, session IDs, etc.
 */
export function socketAuthMiddleware(
  socket: AuthenticatedSocket,
  next: (err?: Error) => void,
) {
  try {
    const playerId = socket.handshake.query.playerId as string;
    const sessionId = socket.handshake.query.sessionId as string;

    if (!playerId || !sessionId) {
      logger.warn("Socket auth: Missing credentials", { socketId: socket.id });
      return next(new Error("Missing playerId or sessionId"));
    }

    socket.data = {
      ...(socket.data ?? {}),
      playerId,
      sessionId,
    };

    logger.debug("Socket authenticated", { socketId: socket.id, playerId });
    next();
  } catch (error) {
    logger.error("Socket auth error", {
      error: error instanceof Error ? error.message : String(error),
    });
    next(error as Error);
  }
}
