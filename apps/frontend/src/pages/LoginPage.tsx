import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "../components/layout";

export default function LoginPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");

  const handleLogin = () => {
    if (name.trim()) {
      localStorage.setItem("playerName", name);
      navigate("/");
    }
  };

  return (
    <Container className="flex items-center justify-center py-16">
      <div className="card w-full max-w-md">
        <h1 className="mb-6 text-center text-3xl font-bold">Enter Your Name</h1>
        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          className="mb-4 w-full rounded border border-gray-600 bg-gray-700 px-4 py-2 text-white placeholder-gray-400"
        />
        <button onClick={handleLogin} className="btn btn-primary w-full">
          Continue
        </button>
      </div>
    </Container>
  );
}
