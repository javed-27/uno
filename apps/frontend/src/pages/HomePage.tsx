import React, { useState } from "react";
import { Container } from "../components/layout";
import { useSocket } from "../services/socket";

export default function HomePage() {
  const { isConnected, createRoom, joinRoom, error } = useSocket();
  const [roomCode, setRoomCode] = useState("");
  const [playerName, setPlayerName] = useState(() =>
    localStorage.getItem("playerName") || ""
  );
  const [busy, setBusy] = useState(false);
  const [pageError, setPageError] = useState<string | null>(null);

  const handleCreateRoom = async () => {
    if (!playerName.trim()) return;

    localStorage.setItem("playerName", playerName);
    setBusy(true);
    setPageError(null);

    try {
      await createRoom(playerName.trim());
    } catch (err) {
      setPageError(String(err));
    } finally {
      setBusy(false);
    }
  };

  const handleJoinRoom = async () => {
    if (!roomCode.trim() || !playerName.trim()) return;

    localStorage.setItem("playerName", playerName);
    setBusy(true);
    setPageError(null);

    try {
      await joinRoom(roomCode.trim(), playerName.trim());
    } catch (err) {
      setPageError(String(err));
    } finally {
      setBusy(false);
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

        {(pageError || error) && (
          <div className="mb-6 rounded border border-red-500 bg-red-600/20 p-3 text-sm text-red-100">
            {pageError || error}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
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
              disabled={!playerName.trim() || busy}
              className="btn btn-primary w-full disabled:opacity-50"
            >
              Create New Game
            </button>
          </div>

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
              disabled={!roomCode.trim() || !playerName.trim() || busy}
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
