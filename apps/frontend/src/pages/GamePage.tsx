import React, { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Container } from "../components/layout";
import { UnoColor, useSocket } from "../services/socket";

export default function GamePage() {
  const { roomCode } = useParams();
  const {
    room,
    playerId,
    isConnected,
    playCard,
    drawCard,
    callUno,
    error,
  } = useSocket();
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [chosenColor, setChosenColor] = useState<Exclude<UnoColor, "wild">>(
    "red",
  );

  const currentPlayerId = room?.game?.currentPlayerId;
  const isYourTurn = currentPlayerId === playerId;
  const player = room?.players.find((item) => item.id === playerId);
  const yourHand = room?.yourHand ?? [];
  const currentCard = room?.game?.currentCard;
  const currentColor = room?.game?.currentColor;
  const winner = room?.winnerId
    ? room.players.find((item) => item.id === room.winnerId)
    : undefined;

  const selectedCard = yourHand.find((card) => card.id === selectedCardId);

  const playableCards = useMemo(() => {
    if (!currentCard || !currentColor) return [];
    return yourHand.filter((card) => {
      if (card.color === "wild") return true;
      if (card.color === currentColor) return true;
      return card.value === currentCard.value;
    });
  }, [yourHand, currentCard, currentColor]);

  const handlePlayCard = async () => {
    if (!selectedCard || !room) return;
    const chosen = selectedCard.color === "wild" ? chosenColor : undefined;

    try {
      await playCard(selectedCard.id, chosen);
      setSelectedCardId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDrawCard = async () => {
    if (!room) return;
    try {
      await drawCard();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCallUno = async () => {
    if (!room) return;
    try {
      await callUno();
    } catch (err) {
      console.error(err);
    }
  };

  if (!room) {
    return (
      <Container className="flex min-h-[calc(100vh-200px)] items-center justify-center">
        <div className="card w-full max-w-md text-center">
          <h1 className="mb-4 text-3xl font-bold">Waiting for room data...</h1>
          <p className="text-gray-400">Connect to a game lobby to continue.</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-8">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Game: {roomCode}</h1>
          <p className="text-sm text-gray-400">Room code: {room.roomCode}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div
            className={`h-2 w-2 rounded-full ${
              isConnected ? "bg-green-500" : "bg-red-500"
            }`}
          />
          <span className="text-sm text-gray-400">
            {isConnected ? "Connected" : "Disconnected"}
          </span>
          <span className="rounded-full bg-gray-800 px-3 py-1 text-sm text-gray-200">
            {room.gameState === "finished"
              ? "Finished"
              : isYourTurn
              ? "Your turn"
              : "Waiting"}
          </span>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded border border-red-500 bg-red-600/20 p-4 text-sm text-red-100">
          {error}
        </div>
      )}

      {room.gameState === "finished" && winner && (
        <div className="mb-6 rounded border border-yellow-400 bg-yellow-500/10 p-4 text-yellow-100">
          Winner: {winner.name}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[1.8fr_1fr]">
        <div className="space-y-6">
          <div className="card">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="text-xl font-semibold">Current Card</h2>
                <div className="mt-3 inline-flex items-center gap-3 rounded-2xl border border-gray-600 bg-gray-900 px-4 py-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-700 text-sm uppercase text-white">
                    {currentCard?.color === "wild"
                      ? "W"
                      : currentCard?.color?.charAt(0).toUpperCase()}
                  </span>
                  <div>
                    <p className="font-semibold text-white">
                      {String(currentCard?.value)}
                    </p>
                    <p className="text-xs text-gray-400">
                      Color: {currentColor}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                <div className="rounded-lg border border-gray-700 bg-gray-800 p-4 text-sm">
                  <div className="text-xs text-gray-400">Deck</div>
                  <div className="mt-2 text-2xl font-bold text-white">
                    {room.game?.deck.length ?? 0}
                  </div>
                </div>
                <div className="rounded-lg border border-gray-700 bg-gray-800 p-4 text-sm">
                  <div className="text-xs text-gray-400">Discard</div>
                  <div className="mt-2 text-2xl font-bold text-white">
                    {room.game?.discardPile.length ?? 0}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="mb-4 text-xl font-semibold">Table</h2>
            <div className="space-y-3">
              {room.players.map((player) => (
                <div
                  key={player.id}
                  className="flex items-center justify-between rounded bg-gray-900 px-4 py-3"
                >
                  <div>
                    <p className="font-semibold text-white">{player.name}</p>
                    <p className="text-xs text-gray-400">
                      {player.isHost ? "Host" : "Player"} • {player.cardCount}
                      {" "}
                      cards
                    </p>
                  </div>
                  <div className="text-right text-xs text-gray-400">
                    {room.game?.currentPlayerId === player.id ? "Current" : ""}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h2 className="mb-4 text-xl font-semibold">Play Area</h2>
            <div className="grid gap-3">
              <div className="grid gap-2 sm:grid-cols-2">
                <button
                  onClick={handleDrawCard}
                  disabled={!isYourTurn || room.gameState !== "in-progress"}
                  className="btn btn-primary w-full disabled:opacity-50"
                >
                  Draw Card
                </button>
                <button
                  onClick={handleCallUno}
                  disabled={!isYourTurn || !player || player.cardCount !== 1}
                  className="btn btn-secondary w-full disabled:opacity-50"
                >
                  Call UNO
                </button>
              </div>

              {selectedCard?.color === "wild" && (
                <div className="rounded border border-gray-700 bg-gray-800 p-4">
                  <p className="mb-2 text-sm text-gray-400">Choose a color</p>
                  <div className="flex flex-wrap gap-2">
                    {(["red", "green", "blue", "yellow"] as const).map((
                      color,
                    ) => (
                      <button
                        key={color}
                        onClick={() => setChosenColor(color)}
                        className={`rounded-full px-3 py-1 text-sm ${
                          chosenColor === color
                            ? "bg-white text-black"
                            : "bg-gray-700 text-gray-200"
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={handlePlayCard}
                disabled={!isYourTurn || !selectedCard}
                className="btn btn-primary w-full disabled:opacity-50"
              >
                Play Selected Card
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card">
            <h2 className="mb-4 text-xl font-semibold">Your Hand</h2>
            <div className="grid gap-3">
              {yourHand.length === 0
                ? <p className="text-sm text-gray-400">No cards in hand.</p>
                : (
                  yourHand.map((card) => (
                    <button
                      key={card.id}
                      onClick={() => setSelectedCardId(card.id)}
                      className={`rounded-xl border px-4 py-3 text-left transition-all ${
                        selectedCardId === card.id
                          ? "border-blue-400 bg-blue-500/10"
                          : "border-gray-700 bg-gray-900"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <span className="font-semibold text-white">
                          {String(card.value)}
                        </span>
                        <span className="rounded-full bg-gray-800 px-3 py-1 text-xs uppercase text-gray-300">
                          {card.color}
                        </span>
                      </div>
                    </button>
                  ))
                )}
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
