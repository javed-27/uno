export const UNO_COLORS = ["red", "green", "blue", "yellow"] as const;
export const UNO_NUMBER_CARDS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as const;
export const UNO_ACTION_CARDS = ["skip", "reverse", "draw2"] as const;
export const UNO_WILD_CARDS = ["wild", "wild_draw4"] as const;

export type UnoColor = (typeof UNO_COLORS)[number] | "wild";
export type UnoNumberValue = (typeof UNO_NUMBER_CARDS)[number];
export type UnoActionValue = (typeof UNO_ACTION_CARDS)[number];
export type UnoWildValue = (typeof UNO_WILD_CARDS)[number];
export type UnoValue = UnoNumberValue | UnoActionValue | UnoWildValue;

export interface UnoCard {
  id: string;
  color: Exclude<UnoColor, "wild"> | "wild";
  value: UnoValue;
}

export interface UnoGameState {
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

const makeCardId = (color: string, value: string | number, index: number) =>
  `${color}-${value}-${index}`;

export function createUnoDeck(): UnoCard[] {
  const deck: UnoCard[] = [];

  UNO_COLORS.forEach((color) => {
    deck.push({ id: makeCardId(color, 0, 0), color, value: 0 });

    UNO_NUMBER_CARDS.slice(1).forEach((number) => {
      deck.push({ id: makeCardId(color, number, 1), color, value: number });
      deck.push({ id: makeCardId(color, number, 2), color, value: number });
    });

    UNO_ACTION_CARDS.forEach((action) => {
      deck.push({ id: makeCardId(color, action, 1), color, value: action });
      deck.push({ id: makeCardId(color, action, 2), color, value: action });
    });
  });

  UNO_WILD_CARDS.forEach((wild) => {
    for (let index = 1; index <= 4; index += 1) {
      deck.push({
        id: makeCardId("wild", wild, index),
        color: "wild",
        value: wild,
      });
    }
  });

  return deck;
}

export function shuffleCards<T>(cards: T[]): T[] {
  const copy = [...cards];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function getRandomColor(): Exclude<UnoColor, "wild"> {
  return UNO_COLORS[Math.floor(Math.random() * UNO_COLORS.length)];
}

interface DrawResult {
  cards: UnoCard[];
  deck: UnoCard[];
  discardPile: UnoCard[];
}

export function drawCards(
  deck: UnoCard[],
  count: number,
  discardPile: UnoCard[],
): DrawResult {
  const deckCopy = [...deck];
  const discardCopy = [...discardPile];
  const drawn: UnoCard[] = [];

  while (drawn.length < count) {
    if (deckCopy.length === 0) {
      if (discardCopy.length <= 1) {
        break;
      }

      const topCard = discardCopy.pop() as UnoCard;
      const reshuffled = shuffleCards(discardCopy);
      deckCopy.push(...reshuffled);
      discardCopy.length = 0;
      discardCopy.push(topCard);
    }

    const card = deckCopy.shift();
    if (!card) {
      break;
    }

    drawn.push(card);
  }

  return {
    cards: drawn,
    deck: deckCopy,
    discardPile: discardCopy,
  };
}

export function isCardPlayable(
  card: UnoCard,
  topCard: UnoCard,
  currentColor: Exclude<UnoColor, "wild">,
): boolean {
  if (card.color === "wild") {
    return true;
  }

  if (card.color === currentColor) {
    return true;
  }

  if (card.value === topCard.value) {
    return true;
  }

  return false;
}

export function pickInitialTopCard(
  deck: UnoCard[],
  discardPile: UnoCard[],
): {
  deck: UnoCard[];
  discardPile: UnoCard[];
  topCard: UnoCard;
  currentColor: Exclude<UnoColor, "wild">;
} {
  const deckCopy = [...deck];
  const discardCopy = [...discardPile];
  let topCard = deckCopy.shift() as UnoCard;

  while (topCard?.value === "wild" || topCard?.value === "wild_draw4") {
    deckCopy.push(topCard);
    const shuffled = shuffleCards(deckCopy);
    deckCopy.length = 0;
    deckCopy.push(...shuffled);
    topCard = deckCopy.shift() as UnoCard;
  }

  discardCopy.push(topCard);

  return {
    deck: deckCopy,
    discardPile: discardCopy,
    topCard,
    currentColor: topCard.color as Exclude<UnoColor, "wild">,
  };
}

export function getNextPlayerIndex(
  currentIndex: number,
  direction: 1 | -1,
  playerCount: number,
  skip = 1,
): number {
  const raw = currentIndex + direction * skip;
  return ((raw % playerCount) + playerCount) % playerCount;
}
