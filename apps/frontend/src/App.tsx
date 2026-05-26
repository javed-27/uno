import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SocketProvider } from "./services/socket";
import { Container, Footer, Header } from "./components/layout";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import LobbyPage from "./pages/LobbyPage";
import GamePage from "./pages/GamePage";
import WinPage from "./pages/WinPage";

function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/lobby/:roomCode" element={<LobbyPage />} />
          <Route path="/game/:roomCode" element={<GamePage />} />
          <Route path="/win/:roomCode" element={<WinPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <SocketProvider>
        <AppLayout />
      </SocketProvider>
    </BrowserRouter>
  );
}
