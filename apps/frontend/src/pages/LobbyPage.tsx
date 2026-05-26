import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container } from "../components/layout";
import { useSocket } from "../services/socket";

export default function LobbyPage() {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const { room, playerId, isConnected, startGame, leaveRoom, error } =
    useSocket();

  const isHost = room?.hostId === playerId;
  const players = room?.players ?? [];
  const canStart = isHost && players.length >= 2 &&
    room?.gameState === "waiting";

  const handleStartGame = async () => {
    if (!room) return;
    try {
      await startGame();
    } catch (err) {
      console.error(err);
    }
  };

  const handleLeaveRoom = async () => {
    try {
      await leaveRoom();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container className="flex min-h-[calc(100vh-200px)] items-center justify-center">
      <div className="w-full max-w-md">
        <div className="card">
          <h1 className="mb-2 text-2xl font-bold">Room: {roomCode}</h1>
          <div className="mb-4 flex items-center gap-2">
            <div
              className={`h-2 w-2 rounded-full ${
                isConnected ? "bg-green-500" : "bg-red-500"
              }`}
            />
            <span className="text-sm text-gray-400">
              {isConnected ? "Connected" : "Disconnected"}
            </span>
          </div>

          {error && (
            <p className="mb-4 rounded border border-red-500 bg-red-600/20 px-3 py-2 text-sm text-red-100">
              {error}
            </p>
          )}

          <div className="mb-6">
            <h2 className="mb-3 font-semibold">
              Players ({players.length}/6)
            </h2>
            <div className="space-y-2">
              {players.length > 0
                ? (
                  players.map((player) => (
                    <div
                      key={player.id}
                      className="flex items-center justify-between rounded bg-gray-700 px-3 py-2"
                    >
                      <span>{player.name}</span>
                      {player.isHost && (
                        <span className="text-xs text-blue-300">Host</span>
                      )}
                    </div>
                  ))
                )
                : (
                  <p className="text-sm text-gray-400">
                    Waiting for players...
                  </p>
                )}
            </div>
          </div>

          {canStart
            ? (
              <button
                onClick={handleStartGame}
                className="btn btn-primary w-full"
              >
                Start Game
              </button>
            )
            : (
              <p className="text-center text-sm text-gray-400">
                {isHost
                  ? "Waiting for at least 2 players to start."
                  : "Waiting for host to start the game..."}
              </p>
            )}

          <button
            onClick={handleLeaveRoom}
            className="btn btn-secondary mt-3 w-full"
          >
            Leave Room
          </button>
        </div>
      </div>
    </Container>
  );
}
