import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container } from "../components/layout";
import { useSocket } from "../services/socket";

export default function LobbyPage() {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const { isConnected } = useSocket();
  const [players, setPlayers] = useState<string[]>([]); // Phase 5: populate from socket
  const isHost = true; // Phase 5: determine from room state

  const handleStartGame = () => {
    // Phase 5: emit START_GAME event
    navigate(`/game/${roomCode}`);
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

          <div className="mb-6">
            <h2 className="mb-3 font-semibold">Players ({players.length}/6)</h2>
            <div className="space-y-2">
              {players.length > 0
                ? (
                  players.map((player, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded bg-gray-700 px-3 py-2"
                    >
                      <span>{player}</span>
                      {isHost && idx > 0 && (
                        <button className="text-xs text-red-400 hover:text-red-300">
                          Kick
                        </button>
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

          {isHost && players.length >= 2 && (
            <button
              onClick={handleStartGame}
              className="btn btn-primary w-full"
            >
              Start Game
            </button>
          )}
          {!isHost && (
            <p className="text-center text-sm text-gray-400">
              Waiting for host to start game...
            </p>
          )}

          <button
            onClick={() => navigate("/")}
            className="btn btn-secondary mt-3 w-full"
          >
            Leave Room
          </button>
        </div>
      </div>
    </Container>
  );
}
