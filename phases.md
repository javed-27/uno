# UNO Multiplayer Game — Incremental Copilot Generation Plan

This document breaks the UNO multiplayer game into structured implementation phases.

Goal:

* Avoid massive Copilot hallucinations
* Generate stable architecture
* Keep code maintainable
* Allow feature-by-feature generation
* Reduce broken imports and inconsistent implementations

Use each phase separately with GitHub Copilot Agent.

Do NOT skip phases.

---

# Recommended Workflow

For EACH phase:

1. Create a git commit before generation
2. Open Copilot Agent
3. Paste ONLY the current phase prompt
4. Let Copilot generate files
5. Fix compile/runtime issues immediately
6. Test before moving forward
7. Commit changes
8. Continue to next phase

---

# FINAL TECH STACK

Frontend:

* React
* TypeScript
* Vite
* TailwindCSS
* Framer Motion
* Socket.IO Client

Backend:

* Node.js
* Express.js
* Socket.IO
* TypeScript

Architecture:

* Backend authoritative multiplayer
* In-memory room state
* Feature/module-based frontend
* Multiple simultaneous rooms

---

# IMPLEMENTATION PHASES

1. Project Foundation
2. Backend Core Setup
3. Frontend Core Setup
4. Socket Architecture
5. Room System
6. Lobby System
7. UNO Game Engine
8. Turn System + Timer
9. Card Play Logic
10. UNO Rules + Penalties
11. Wild Draw Four Challenge System
12. Reconnection System
13. Chat System
14. Frontend Game UI
15. Animations
16. Mobile Responsiveness
17. Docker Setup
18. Testing
19. Optimization + Cleanup
20. Production Readiness

---

# PHASE 1 — PROJECT FOUNDATION

## Goal

Create complete monorepo foundation.

---

## Prompt

Create a production-style monorepo structure for a realtime multiplayer UNO game.

Tech stack:

* React + TypeScript + Vite frontend
* Node.js + Express + Socket.IO + TypeScript backend
* TailwindCSS
* Framer Motion
* Docker support

Requirements:

* apps/frontend
* apps/backend
* ESLint
* Prettier
* Husky
* shared tsconfig strategy
* environment files
* scripts for development
* docker-compose skeleton

Frontend structure:

src/
features/
components/
hooks/
services/
socket/
types/
utils/
pages/

Backend structure:

src/
server/
socket/
rooms/
players/
game-engine/
timers/
validation/
chat/
utils/
types/
tests/

Generate:

* package.json files
* tsconfig files
* Vite config
* Tailwind setup
* Express starter
* Socket.IO starter
* basic React app
* routing setup
* lint configs
* prettier configs
* folder structure
* README

Do not implement game logic yet.

---

# PHASE 2 — BACKEND CORE SETUP

## Goal

Build backend server architecture.

---

## Prompt

Create backend infrastructure for a realtime multiplayer UNO game.

Requirements:

* Express server
* Socket.IO integration
* TypeScript strict mode
* centralized config
* error handling middleware
* logger utility
* room registry
* socket authentication middleware
* environment validation
* server startup flow

Create:

* app.ts
* server.ts
* socketServer.ts
* config system
* constants
* typed socket interfaces
* utility helpers

Implement clean architecture.

Do not implement gameplay yet.

---

# PHASE 3 — FRONTEND CORE SETUP

## Goal

Build frontend architecture.

---

## Prompt

Create frontend architecture for a multiplayer UNO game.

Requirements:

* React + TypeScript
* TailwindCSS
* React Router
* Framer Motion
* modular feature architecture
* responsive layouts

Create pages:

* LoginPage
* HomePage
* LobbyPage
* GamePage
* WinPage

Create:

* route setup
* layout system
* reusable button/input/card components
* socket provider
* global app structure
* responsive shell
* theme foundation

Do not implement gameplay logic yet.

---

# PHASE 4 — SOCKET ARCHITECTURE

## Goal

Build typed socket communication system.

---

## Prompt

Implement a fully typed Socket.IO architecture.

Requirements:

* shared event contracts
* clientToServerEvents
* serverToClientEvents
* strongly typed payloads
* reusable socket service
* frontend socket hooks
* backend socket handlers

Required events:

* CREATE_ROOM
* JOIN_ROOM
* LEAVE_ROOM
* START_GAME
* PLAY_CARD
* DRAW_CARD
* CALL_UNO
* SEND_CHAT
* CHALLENGE_WILD_DRAW_FOUR
* RECONNECT_PLAYER
* KICK_PLAYER

Implement:

* socket connection lifecycle
* disconnect handling
* event validation
* typed emissions

No game logic yet.

---

# PHASE 5 — ROOM SYSTEM

## Goal

Implement multiplayer room management.

---

## Prompt

Implement multiplayer room management.

Requirements:

* multiple simultaneous rooms
* room code generation
* room cleanup
* host system
* host transfer
* player join/leave
* player kicking
* reconnect support
* room state synchronization

Room model:

* roomId
* hostId
* players
* gameState
* timerState
* chatHistory

Implement:

* RoomManager
* PlayerManager
* room validation
* room lifecycle
* reconnect grace timeout

No gameplay logic yet.

---

# PHASE 6 — LOBBY SYSTEM

## Goal

Implement pre-game lobby.

---

## Prompt

Implement multiplayer lobby system.

Requirements:

* room join flow
* player list
* host controls
* lobby synchronization
* start game validation
* lobby chat
* ready state support
* room code sharing UI

Host can:

* start game
* kick players

Minimum:

* 2 players
* maximum 6 players

Create:

* frontend lobby UI
* backend lobby handlers
* socket sync logic

---

# PHASE 7 — UNO GAME ENGINE

## Goal

Build isolated UNO game engine.

---

## Prompt

Create a backend-authoritative UNO game engine.

IMPORTANT:

* no frontend logic
* pure business logic only
* no socket dependencies

Create:

* DeckManager
* CardValidator
* RuleEngine
* UnoEngine
* TurnManager
* ChallengeEngine

Implement:

* deck generation
* shuffle logic
* dealing cards
* discard pile
* draw pile
* turn direction
* player rotation
* valid card matching

Card types:

* Number
* Skip
* Reverse
* DrawTwo
* Wild
* WildDrawFour

Colors:

* Red
* Blue
* Green
* Yellow

Use strict TypeScript.

---

# PHASE 8 — TURN SYSTEM + TIMER

## Goal

Implement realtime turn management.

---

## Prompt

Implement realtime turn system.

Requirements:

* 20-second timer
* synchronized countdown
* automatic timeout handling
* turn transitions
* reverse handling
* skip handling

On timeout:

* auto draw one card
* auto end turn

Implement:

* TimerManager
* turn synchronization
* timer events
* frontend timer UI
* timeout animations

Backend authoritative only.

---

# PHASE 9 — CARD PLAY LOGIC

## Goal

Implement realtime gameplay.

---

## Prompt

Implement realtime card gameplay.

Requirements:

* click-to-play
* server-side validation
* animated updates
* draw card system
* discard pile updates
* current turn validation
* game state synchronization

Implement:

* PLAY_CARD flow
* DRAW_CARD flow
* card ownership validation
* playable card validation
* draw pile reshuffling

Frontend must only render server state.

---

# PHASE 10 — UNO RULES + PENALTIES

## Goal

Implement full UNO logic.

---

## Prompt

Implement official UNO penalty rules.

Requirements:

* UNO button
* UNO state tracking
* UNO catch system
* +2 penalty logic
* realtime synchronization
* event notifications

Rules:

* player must press UNO at 1 card
* if caught before next turn:

  * draw 2 cards

Implement:

* frontend UNO button
* server-side UNO validation
* penalty broadcasts
* animations and effects

---

# PHASE 11 — WILD DRAW FOUR CHALLENGE SYSTEM

## Goal

Implement official challenge rules.

---

## Prompt

Implement full Wild Draw Four challenge system.

Requirements:

* server-side validation
* challenge flow
* hidden hand validation
* challenge results synchronization

Rules:

* +4 allowed only if no matching color exists

If guilty:

* offender draws 4

If innocent:

* challenger draws 6

Implement:

* challenge events
* challenge UI
* challenge resolution logic
* animations

---

# PHASE 12 — RECONNECTION SYSTEM

## Goal

Support reconnecting players.

---

## Prompt

Implement player reconnection system.

Requirements:

* sessionId persistence
* localStorage support
* reconnect flow
* restore player hand
* restore room state
* restore timer state
* grace disconnect timeout

Implement:

* reconnect middleware
* session recovery
* frontend reconnect handling
* backend reconnect validation

---

# PHASE 13 — CHAT SYSTEM

## Goal

Implement realtime chat.

---

## Prompt

Implement realtime chat system.

Requirements:

* lobby chat
* in-game chat
* timestamps
* player names
* realtime updates
* mobile responsive UI

Implement:

* chat backend
* chat socket events
* frontend chat panel
* message history

---

# PHASE 14 — FRONTEND GAME UI

## Goal

Build polished game UI.

---

## Prompt

Build polished multiplayer UNO game UI.

Requirements:

* responsive layouts
* animated card hands
* player panels
* current turn highlights
* discard pile
* draw pile
* direction indicators
* timer display
* chat panel
* UNO button
* challenge UI

Design style:

* modern multiplayer game
* glassmorphism
* gradients
* polished animations
* neon highlights

Use:

* TailwindCSS
* Framer Motion

---

# PHASE 15 — ANIMATIONS

## Goal

Add game feel.

---

## Prompt

Implement polished multiplayer animations.

Requirements:

* card dealing animation
* card play animation
* draw animation
* reverse animation
* UNO glow effect
* turn pulse effect
* timer urgency animation
* winner celebration

Use Framer Motion.

Animations must remain performant.

---

# PHASE 16 — MOBILE RESPONSIVENESS

## Goal

Optimize for mobile.

---

## Prompt

Optimize the UNO game for mobile responsiveness.

Requirements:

* touch-friendly controls
* responsive layouts
* scalable card sizing
* adaptive hand layouts
* portrait support
* tablet support

Ensure gameplay remains usable on small screens.

---

# PHASE 17 — DOCKER SETUP

## Goal

Containerize application.

---

## Prompt

Create Docker support for the UNO multiplayer project.

Requirements:

* frontend Dockerfile
* backend Dockerfile
* docker-compose.yml
* environment configuration
* development startup
* production-ready setup

Application must run using:

docker-compose up

---

# PHASE 18 — TESTING

## Goal

Add backend game engine tests.

---

## Prompt

Create comprehensive backend tests.

Test:

* card validation
* reverse logic
* skip logic
* draw two logic
* wild draw four legality
* challenge system
* reshuffling
* UNO penalties
* timeout handling
* winner detection

Use Vitest or Jest.

---

# PHASE 19 — OPTIMIZATION + CLEANUP

## Goal

Improve quality and performance.

---

## Prompt

Optimize and refactor the UNO multiplayer project.

Requirements:

* reduce unnecessary rerenders
* optimize socket emissions
* cleanup memory leaks
* improve type safety
* improve architecture consistency
* reduce duplicate logic
* improve readability
* improve responsiveness

Perform production-quality cleanup.

---

# PHASE 20 — PRODUCTION READINESS

## Goal

Finalize project.

---

## Prompt

Prepare the UNO multiplayer project for production readiness.

Requirements:

* final README
* environment docs
* deployment docs
* architecture docs
* socket event documentation
* error handling review
* security review
* scalability review
* final cleanup

Ensure application is stable and maintainable.

---

# IMPORTANT RULES FOR ALL PHASES

Always:

* use strict TypeScript
* keep backend authoritative
* maintain modular architecture
* avoid duplicated logic
* validate all socket events
* maintain responsive UI
* write reusable components
* use proper typing everywhere

Never:

* move game logic to frontend
* trust frontend payloads
* use mock multiplayer
* use polling instead of sockets
* create giant files
* hardcode game state

---

# RECOMMENDED DEVELOPMENT ORDER

1. Phase 1
2. Phase 2
3. Phase 3
4. Phase 4
5. Phase 5
6. Phase 6
7. Phase 7
8. Phase 8
9. Phase 9
10. Phase 10
11. Phase 11
12. Phase 12
13. Phase 13
14. Phase 14
15. Phase 15
16. Phase 16
17. Phase 17
18. Phase 18
19. Phase 19
20. Phase 20

Never jump ahead before current phase works co
