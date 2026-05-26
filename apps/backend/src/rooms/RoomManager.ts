/**
 * Room management utilities
 */

import { CONSTANTS } from "../constants";
import {
  Player,
  PublicPlayer,
  RoomGameState,
  RoomPublicState,
  RoomState,
  TypedSocket,
} from "../types";
import {
  createUnoDeck,
  drawCards,
  getNextPlayerIndex,
  getRandomColor,
  isCardPlayable,
  pickInitialTopCard,
  shuffleCards,
  UnoCard,
  UnoGameState,
} from "../game-engine/uno";

function createId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export class RoomManager {
  private rooms = new Map<string, RoomState>();
  private codeToRoomId = new Map<string, string>();
  private turnTimers = new Map<string, ReturnType<typeof setTimeout>>();

  createRoom(
    hostId: string,
    hostName: string,
    hostSocketId: string,
  ): RoomState {
    const roomId = createId("room");
    const roomCode = this.generateRoomCode();
    const hostPlayer: Player = {
      id: hostId,
      name: hostName,
      socketId: hostSocketId,
      hand: [],
      hasCalledUno: false,
      isConnected: true,
    };

    const room: RoomState = {
      roomId,
      roomCode,
      hostId,
      players: [hostPlayer],
      gameState: "waiting",
      game: undefined,
      winnerId: undefined,
      timerExpiresAt: null,
    };

    this.rooms.set(roomId, room);
    this.codeToRoomId.set(roomCode, roomId);

    return room;
  }

  getRoom(roomId: string): RoomState | undefined {
    return this.rooms.get(roomId);
  }

  getRoomByCode(code: string): RoomState | undefined {
    const roomId = this.codeToRoomId.get(code);
    return roomId ? this.rooms.get(roomId) : undefined;
  }

  deleteRoom(roomId: string): boolean {
    const room = this.rooms.get(roomId);
    if (!room) return false;

    this.rooms.delete(roomId);
    this.turnTimers.delete(roomId);

    Array.from(this.codeToRoomId.entries()).forEach(([code, id]) => {
      if (id === roomId) {
        this.codeToRoomId.delete(code);
      }
    });

    return true;
  }

  addPlayerToRoom(roomId: string, player: Player): boolean {
    const room = this.rooms.get(roomId);
    if (!room || room.gameState !== "waiting") return false;

    if (room.players.some((entry) => entry.id === player.id)) {
      return false;
    }

    room.players.push(player);
    return true;
  }

  removePlayerFromRoom(roomId: string, playerId: string): boolean {
    const room = this.rooms.get(roomId);
    if (!room) return false;

    const index = room.players.findIndex((player) => player.id === playerId);
    if (index === -1) return false;

    room.players.splice(index, 1);

    if (room.hostId === playerId && room.players.length > 0) {
      room.hostId = room.players[0].id;
    }

    if (room.players.length === 0) {
      this.clearRoomTimers(roomId);
      this.deleteRoom(roomId);
      return true;
    }

    return true;
  }

  startGame(roomId: string, hostId: string): RoomState | undefined {
    const room = this.rooms.get(roomId);
    if (!room || room.hostId !== hostId) return undefined;
    if (room.players.length < CONSTANTS.MIN_PLAYERS) return undefined;
    if (room.gameState !== "waiting") return undefined;

    const deck = shuffleCards(createUnoDeck());
    const discardPile: UnoCard[] = [];
    let currentDeck = [...deck];

    room.players = room.players.map((player) => ({
      ...player,
      hand: [],
      hasCalledUno: false,
      isConnected: true,
    }));

    room.players.forEach((player) => {
      const result = drawCards(currentDeck, 7, discardPile);
      player.hand = result.cards;
      currentDeck = result.deck;
    });

    const starting = pickInitialTopCard(currentDeck, discardPile);
    currentDeck = starting.deck;

    const game: UnoGameState = {
      deck: currentDeck,
      discardPile: starting.discardPile,
      currentCard: starting.topCard,
      currentColor: starting.currentColor,
      direction: 1,
      currentPlayerId: room.players[0].id,
      pendingDrawCount: 0,
      pendingDrawType: null,
      pendingUnoPlayerId: null,
    };

    room.game = game;
    room.gameState = "in-progress";
    room.winnerId = undefined;
    room.timerExpiresAt = null;

    return room;
  }

  playCard(
    roomId: string,
    playerId: string,
    cardId: string,
    chosenColor?: Exclude<UnoCard["color"], "wild">,
  ): RoomState | undefined {
    const room = this.rooms.get(roomId);
    if (!room || room.gameState !== "in-progress" || !room.game) {
      return undefined;
    }
    if (room.game.currentPlayerId !== playerId) return undefined;

    const player = room.players.find((current) => current.id === playerId);
    if (!player) return undefined;

    const cardIndex = player.hand.findIndex((card) => card.id === cardId);
    if (cardIndex === -1) return undefined;

    const card = player.hand[cardIndex];

    if (!isCardPlayable(card, room.game.currentCard, room.game.currentColor)) {
      return undefined;
    }

    const selectedColor = card.color === "wild" ? chosenColor : card.color;
    if (card.color === "wild" && !selectedColor) {
      return undefined;
    }

    player.hand.splice(cardIndex, 1);
    room.game.discardPile.push(card);
    room.game.currentCard = card;
    room.game.currentColor = selectedColor as Exclude<UnoCard["color"], "wild">;

    if (player.hand.length === 1) {
      player.hasCalledUno = false;
      room.game.pendingUnoPlayerId = playerId;
    }

    if (player.hand.length === 0) {
      if (!player.hasCalledUno) {
        const penalty = drawCards(room.game.deck, 2, room.game.discardPile);
        player.hand.push(...penalty.cards);
        room.game.deck = penalty.deck;
        room.game.discardPile = penalty.discardPile;
        room.game.pendingUnoPlayerId = null;
        this.advanceToNextPlayer(room, 1);
        return room;
      }

      room.gameState = "finished";
      room.winnerId = playerId;
      this.clearRoomTimers(roomId);
      return room;
    }

    if (card.value === "skip") {
      this.advanceToNextPlayer(room, 2);
      return room;
    }

    if (card.value === "reverse") {
      room.game.direction = room.players.length === 2
        ? 1
        : (room.game.direction * -1) as 1 | -1;
      this.advanceToNextPlayer(room, 1);
      return room;
    }

    if (card.value === "draw2") {
      const nextIndex = this.getNextPlayerIndex(room);
      const opponent = room.players[nextIndex];
      const drawResult = drawCards(room.game.deck, 2, room.game.discardPile);
      opponent.hand.push(...drawResult.cards);
      room.game.deck = drawResult.deck;
      room.game.discardPile = drawResult.discardPile;
      this.advanceToNextPlayer(room, 2);
      return room;
    }

    if (card.value === "wild_draw4") {
      const nextIndex = this.getNextPlayerIndex(room);
      const opponent = room.players[nextIndex];
      const drawResult = drawCards(room.game.deck, 4, room.game.discardPile);
      opponent.hand.push(...drawResult.cards);
      room.game.deck = drawResult.deck;
      room.game.discardPile = drawResult.discardPile;
      this.advanceToNextPlayer(room, 2);
      return room;
    }

    this.advanceToNextPlayer(room, 1);
    return room;
  }

  drawCard(roomId: string, playerId: string): RoomState | undefined {
    const room = this.rooms.get(roomId);
    if (!room || room.gameState !== "in-progress" || !room.game) {
      return undefined;
    }
    if (room.game.currentPlayerId !== playerId) return undefined;

    const player = room.players.find((entry) => entry.id === playerId);
    if (!player) return undefined;

    const drawResult = drawCards(room.game.deck, 1, room.game.discardPile);
    player.hand.push(...drawResult.cards);
    room.game.deck = drawResult.deck;
    room.game.discardPile = drawResult.discardPile;

    if (player.hand.length === 1 && room.game.pendingUnoPlayerId === playerId) {
      room.game.pendingUnoPlayerId = playerId;
    }

    this.advanceToNextPlayer(room, 1);
    return room;
  }

  callUno(roomId: string, playerId: string): RoomState | undefined {
    const room = this.rooms.get(roomId);
    if (!room || room.gameState !== "in-progress" || !room.game) {
      return undefined;
    }

    const player = room.players.find((entry) => entry.id === playerId);
    if (!player || player.hand.length !== 1) return undefined;

    player.hasCalledUno = true;
    if (room.game.pendingUnoPlayerId === playerId) {
      room.game.pendingUnoPlayerId = null;
    }

    return room;
  }

  getPublicRoomState(
    roomId: string,
    requestingPlayerId?: string,
  ): RoomPublicState | undefined {
    const room = this.rooms.get(roomId);
    if (!room) return undefined;

    const publicPlayers: PublicPlayer[] = room.players.map((player) => ({
      id: player.id,
      name: player.name,
      isHost: player.id === room.hostId,
      cardCount: player.hand.length,
      hasCalledUno: player.hasCalledUno,
      isConnected: player.isConnected,
    }));

    const yourPlayer = room.players.find((player) =>
      player.id === requestingPlayerId
    );
    const yourHand = yourPlayer ? [...yourPlayer.hand] : [];

    return {
      roomId: room.roomId,
      roomCode: room.roomCode,
      hostId: room.hostId,
      players: publicPlayers,
      gameState: room.gameState,
      game: room.game ? { ...room.game } : undefined,
      winnerId: room.winnerId,
      timerExpiresAt: room.timerExpiresAt ?? null,
      yourHand,
    };
  }

  scheduleTurnTimer(
    roomId: string,
    onTimeout: (room: RoomState) => void,
  ): void {
    this.clearRoomTimers(roomId);

    const room = this.rooms.get(roomId);
    if (!room || room.gameState !== "in-progress" || !room.game) return;

    const expiresAt = Date.now() + CONSTANTS.TURN_TIMEOUT_SECONDS * 1000;
    room.timerExpiresAt = expiresAt;

    const timer = setTimeout(() => {
      room.timerExpiresAt = null;
      const updatedRoom = this.drawCard(roomId, room.game!.currentPlayerId);
      if (updatedRoom) {
        onTimeout(updatedRoom);
      }
    }, CONSTANTS.TURN_TIMEOUT_SECONDS * 1000);

    this.turnTimers.set(roomId, timer);
  }

  clearRoomTimers(roomId: string): void {
    const timer = this.turnTimers.get(roomId);
    if (timer) {
      clearTimeout(timer);
      this.turnTimers.delete(roomId);
    }
  }

  private getNextPlayerIndex(room: RoomState): number {
    const game = room.game;
    if (!game) {
      return 0;
    }

    const currentIndex = room.players.findIndex(
      (player) => player.id === game.currentPlayerId,
    );

    return getNextPlayerIndex(
      currentIndex,
      game.direction,
      room.players.length,
      1,
    );
  }

  private advanceToNextPlayer(room: RoomState, skip = 1): void {
    const game = room.game;
    if (!game) return;

    const previousUnoId = game.pendingUnoPlayerId;
    const nextIndex = getNextPlayerIndex(
      room.players.findIndex((player) => player.id === game.currentPlayerId),
      game.direction,
      room.players.length,
      skip,
    );

    const nextPlayerId = room.players[nextIndex].id;

    if (previousUnoId && previousUnoId !== nextPlayerId) {
      const offender = room.players.find((player) =>
        player.id === previousUnoId
      );
      if (offender) {
        const penalty = drawCards(game.deck, 2, game.discardPile);
        offender.hand.push(...penalty.cards);
        game.deck = penalty.deck;
        game.discardPile = penalty.discardPile;
      }
      game.pendingUnoPlayerId = null;
    }

    game.currentPlayerId = nextPlayerId;
  }

  private generateRoomCode(): string {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";

    do {
      code = Array.from({ length: CONSTANTS.ROOM_CODE_LENGTH })
        .map(() => characters[Math.floor(Math.random() * characters.length)])
        .join("");
    } while (this.codeToRoomId.has(code));

    return code;
  }
}
