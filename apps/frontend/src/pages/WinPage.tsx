import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container } from "../components/layout";
import { useSocket } from "../services/socket";

export default function WinPage() {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const { room, playerId } = useSocket();

  const winner = room?.players.find((player) => player.id === room.winnerId);
  const youWon = winner?.id === playerId;

  return (
    <Container className="flex min-h-[calc(100vh-200px)] items-center justify-center">
      <div className="card w-full max-w-md text-center">
        <h1 className="mb-4 text-4xl font-bold text-yellow-400">
          {youWon ? "You Won!" : "Game Over"}
        </h1>
        <p className="mb-3 text-lg text-gray-300">
          Room: {roomCode}
        </p>
        <p className="mb-6 text-sm text-gray-400">
          {winner ? `Winner: ${winner.name}` : "Waiting for game results..."}
        </p>
        <div className="mb-8 text-6xl">🎉</div>
        <button
          onClick={() => navigate("/")}
          className="btn btn-primary w-full"
        >
          Back to Home
        </button>
      </div>
    </Container>
  );
}
