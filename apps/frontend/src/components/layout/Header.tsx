import React from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "./Container";

export function Header() {
  const navigate = useNavigate();

  return (
    <header className="border-b border-gray-700 bg-gray-800 py-4">
      <Container className="flex items-center justify-between">
        <div
          onClick={() => navigate("/")}
          className="cursor-pointer text-2xl font-bold text-blue-500 hover:text-blue-400"
        >
          UNO
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/")}
            className="btn btn-secondary text-sm"
          >
            Home
          </button>
        </div>
      </Container>
    </header>
  );
}
