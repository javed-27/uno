// Shared types and socket contracts

export type PlayerId = string;

export interface RoomInfo {
  roomId: string;
  hostId: PlayerId;
}

// Game types (will be expanded in Phase 7)
export enum CardColor {
  Red = "Red",
  Blue = "Blue",
  Green = "Green",
  Yellow = "Yellow",
}

export enum CardType {
  Number = "Number",
  Skip = "Skip",
  Reverse = "Reverse",
  DrawTwo = "DrawTwo",
  Wild = "Wild",
  WildDrawFour = "WildDrawFour",
}

export interface Card {
  id: string;
  color: CardColor | null;
  type: CardType;
  value?: number;
}

export interface GameState {
  roomId: string;
  currentPlayerIndex: number;
  direction: 1 | -1;
  discardPile: Card[];
  drawPile: Card[];
}
