import React, { createContext, useContext, useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  playerId: string | null;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  playerId: null,
});

export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within SocketProvider");
  }
  return context;
}

interface SocketProviderProps {
  children: React.ReactNode;
}

export function SocketProvider({ children }: SocketProviderProps) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [playerId] = useState(() => {
    // Retrieve or generate playerId from localStorage
    const stored = localStorage.getItem("playerId");
    if (stored) return stored;

    const generated = `player_${Date.now()}_${
      Math.random().toString(36).substr(2, 9)
    }`;
    localStorage.setItem("playerId", generated);
    return generated;
  });

  useEffect(() => {
    // Initialize socket connection
    const socketUrl = import.meta.env.VITE_SOCKET_URL ||
      "http://localhost:4000";
    const sessionId = localStorage.getItem("sessionId") ||
      `session_${Date.now()}`;

    localStorage.setItem("sessionId", sessionId);

    const newSocket = io(socketUrl, {
      query: { playerId, sessionId },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
      setIsConnected(true);
    });

    newSocket.on("disconnect", () => {
      console.log("Socket disconnected");
      setIsConnected(false);
    });

    newSocket.on("error", (error) => {
      console.error("Socket error:", error);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [playerId]);

  return (
    <SocketContext.Provider value={{ socket, isConnected, playerId }}>
      {children}
    </SocketContext.Provider>
  );
}
