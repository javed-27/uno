import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "../components/layout";
import { useSocket } from "../services/socket";

export default function HomePage() {
  const navigate = useNavigate();
  const { isConnected } = useSocket();
  const [roomCode, setRoomCode] = useState("");
  const [playerName, setPlayerName] = useState(() =>
    localStorage.getItem("playerName") || ""
  );

  const handleCreateRoom = () => {
    if (playerName.trim()) {
      localStorage.setItem("playerName", playerName);
      // Phase 5: emit CREATE_ROOM event
      navigate("/lobby/new");
    }
  };

  const handleJoinRoom = () => {
    if (roomCode.trim() && playerName.trim()) {
      localStorage.setItem("playerName", playerName);
      navigate(`/lobby/${roomCode}`);
    }
  };

  return (
    <Container className="flex min-h-[calc(100vh-200px)] items-center justify-center">
      <div className="w-full max-w-2xl">
        <h1 className="mb-2 text-center text-5xl font-bold">UNO</h1>
        <p className="mb-8 text-center text-xl text-gray-400">
          Multiplayer Card Game
        </p>

        <div className="mb-6 flex items-center justify-center gap-2">
          <div
            className={`h-3 w-3 rounded-full ${
              isConnected ? "bg-green-500" : "bg-red-500"
            }`}
          />
          <span className="text-sm">
            {isConnected ? "Connected" : "Disconnected"}
          </span>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Create Room */}
          <div className="card">
            <h2 className="mb-4 text-xl font-bold">Create Room</h2>
            <input
              type="text"
              placeholder="Your name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="mb-4 w-full rounded border border-gray-600 bg-gray-700 px-3 py-2 text-white"
            />
            <button
              onClick={handleCreateRoom}
              className="btn btn-primary w-full"
            >
              Create New Game
            </button>
          </div>

          {/* Join Room */}
          <div className="card">
            <h2 className="mb-4 text-xl font-bold">Join Room</h2>
            <input
              type="text"
              placeholder="Your name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="mb-2 w-full rounded border border-gray-600 bg-gray-700 px-3 py-2 text-white"
            />
            <input
              type="text"
              placeholder="Room code"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              maxLength={6}
              className="mb-4 w-full rounded border border-gray-600 bg-gray-700 px-3 py-2 text-white uppercase"
            />
            <button
              onClick={handleJoinRoom}
              disabled={!roomCode.trim()}
              className="btn btn-primary w-full disabled:opacity-50"
            >
              Join Game
            </button>
          </div>
        </div>
      </div>
    </Container>
  );
}
