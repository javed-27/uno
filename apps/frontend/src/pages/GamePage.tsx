import React from "react";
import { useParams } from "react-router-dom";
import { Container } from "../components/layout";
import { useSocket } from "../services/socket";

export default function GamePage() {
  const { roomCode } = useParams();
  const { isConnected } = useSocket();

  return (
    <Container className="py-8">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Game: {roomCode}</h1>
        <div className="flex items-center gap-2">
          <div
            className={`h-2 w-2 rounded-full ${
              isConnected ? "bg-green-500" : "bg-red-500"
            }`}
          />
          <span className="text-sm">
            {isConnected ? "Connected" : "Disconnected"}
          </span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {/* Game area */}
        <div className="md:col-span-3">
          <div className="card h-96 bg-gradient-to-br from-green-900 to-green-700">
            <p className="text-center text-gray-300">
              Game board (Phase 9 - Card Play Logic)
            </p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="card">
            <h3 className="mb-2 font-bold">Timer</h3>
            <p className="text-center text-2xl font-bold">20s</p>
          </div>
          <div className="card">
            <h3 className="mb-2 font-bold">Your Hand</h3>
            <p className="text-sm text-gray-400">Cards: 0</p>
          </div>
          <button className="btn btn-primary w-full">Draw Card</button>
          <button className="btn btn-secondary w-full">UNO!</button>
        </div>
      </div>
    </Container>
  );
}
