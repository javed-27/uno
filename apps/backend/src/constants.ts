/**
 * Backend constants
 */

export const CONSTANTS = {
  // Room settings
  MIN_PLAYERS: 2,
  MAX_PLAYERS: 6,
  ROOM_CODE_LENGTH: 6,

  // Timer settings
  TURN_TIMEOUT_SECONDS: 20,

  // Reconnection
  RECONNECT_GRACE_PERIOD_MS: 5000,

  // Socket events (will be extended in Phase 4)
  SOCKET_EVENTS: {
    // Client to Server
    CREATE_ROOM: "CREATE_ROOM",
    JOIN_ROOM: "JOIN_ROOM",
    LEAVE_ROOM: "LEAVE_ROOM",
    START_GAME: "START_GAME",
    PLAY_CARD: "PLAY_CARD",
    DRAW_CARD: "DRAW_CARD",
    CALL_UNO: "CALL_UNO",
    SEND_CHAT: "SEND_CHAT",
    CHALLENGE_WILD_DRAW_FOUR: "CHALLENGE_WILD_DRAW_FOUR",
    RECONNECT_PLAYER: "RECONNECT_PLAYER",
    KICK_PLAYER: "KICK_PLAYER",

    // Server to Client
    ROOM_CREATED: "ROOM_CREATED",
    ROOM_JOINED: "ROOM_JOINED",
    ROOM_LEFT: "ROOM_LEFT",
    GAME_STARTED: "GAME_STARTED",
    PLAYER_KICKED: "PLAYER_KICKED",
    ERROR: "ERROR",
  },
} as const;
