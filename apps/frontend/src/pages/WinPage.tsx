import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container } from "../components/layout";

export default function WinPage() {
  const { roomCode } = useParams();
  const navigate = useNavigate();

  return (
    <Container className="flex min-h-[calc(100vh-200px)] items-center justify-center">
      <div className="card w-full max-w-md text-center">
        <h1 className="mb-4 text-4xl font-bold text-yellow-400">You Won!</h1>
        <p className="mb-6 text-lg text-gray-300">Room: {roomCode}</p>
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
