# UNO online multiplayer game

I want to build a UNO online multiplayer game using github copilot extension. For that, I want a prompt to create a basic version of UNO game.

# Official UNO Card Game Rules

UNO is a classic card game where players race to get rid of all their cards by matching the top card of the discard pile. The game is played across multiple rounds, and the first player to reach 500 points wins.

---

## 📦 Game Setup

1. **The Deck:** A standard UNO deck consists of **108 cards** (19 of each color Red, Blue, Green, Yellow, alongside action cards).
2. **Deal:** Every player is dealt **7 cards** face down.
3. **The Draw Pile:** Place the rest of the deck face down to create the Draw Pile.
4. **The Discard Pile:** Flip the top card of the Draw Pile face up next to it to start the Discard Pile.

Note: If an action card is flipped to start the game, the first player must resolve that action (e.g., if a Skip is flipped, the first player loses their turn). If it is a Wild Draw 4, put it back in the deck and flip another card.

---

## 🎮 How to Play

Play starts with the player to the left of the dealer and moves **clockwise**.

On your turn, you must match the top card of the Discard Pile using one of three criteria:
**Color:** Play any card matching the active color.
**Number/Symbol:** Play any card matching the number, symbol, or action type (e.g., playing a blue 7 on top of a red 7).
**Wild Card:** Play any Wild or Wild Draw 4 card to change the color.

### Missing a Match

If you cannot make a match, you must **draw one card** from the Draw Pile.
If that drawn card is playable, you can lay it down immediately.
If it isn't, your turn ends and play passes to the next person.
You can also choose to draw a card even if you have a playable card in your hand.

---

## 🃏 Special Action Cards

Action cards are used to disrupt opponents or swing the game in your favor:

| Card                    | Action Effect                                                                                                                                                                        |
| :---------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Skip**                | The next player in line misses their turn completely.                                                                                                                                |
| **Reverse**             | Swaps the direction of play (Clockwise becomes Counter-Clockwise and vice versa).                                                                                                    |
| **Draw Two (+2)**       | The next player must draw 2 cards and forfeit their turn.                                                                                                                            |
| **Wild**                | Can be played on any card. The player calls out a new active color.                                                                                                                  |
| **Wild Draw Four (+4)** | Changes the active color AND forces the next player to draw 4 cards and skip their turn. Restriction: You may only play this if you do not have any cards matching the active color. |

### ⚠️ The Wild Draw 4 Challenge Rule

If a player suspects you played a Wild Draw 4 illegally (meaning you actually had a card matching the active color), they can **challenge** you:
You must show your hand secretly to the challenger.
**If guilty:** You must draw the 4 cards instead.
**If innocent:** The challenger must draw the 4 cards **plus 2 extra penalty cards** (6 total).

---

## 🗣️ Yelling "UNO!" and Winning a Round

**The Call:** When you play your second-to-last card and are down to **exactly 1 card**, you must loudly yell **"UNO!"**.
**The Penalty:** If you forget to say it and another player catches you before the next player begins their turn, you must draw **2 penalty cards**.
**End of Round:** A round ends the exact moment a player successfully plays their final card.

---

## 💯 Points & Scoring

The first player to completely empty their hand wins the round. The winner receives points based on the cards left in their opponents' hands:

**Numbered Cards (0–9):** Face value
**Draw Two / Skip / Reverse:** 20 points each
**Wild / Wild Draw Four:** 50 points each

### Winning the Game

The game continues through multiple rounds until one player accumulates **500 points total** to win the entire game.

(Alternative Elimination Rule: Players track their own remaining card points at the end of each round. When someone hits 500, they are eliminated; the player with the lowest score wins).

---

## Tech Stack

- Frontend: React (Completed High End UI/ Good looking UI)
- Backend: JavaScript

## Game flow

- Login page
  - Just get the username. No fancy Auth.
  - User should get random avatar based on username.
- Home page
  - User can create room
  - User can join room
- Lobby
  - Only host can start the game
- Game page
  - A random guy in the room should get the first turn
  - Game continues normally (turn based)
  - Turn should end in 20sec
- Win Page
  - If any one person win the game. The game should stop.
