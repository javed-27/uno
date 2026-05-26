import React from "react";
import { Container } from "./Container";

export function Footer() {
  return (
    <footer className="border-t border-gray-700 bg-gray-800 py-4">
      <Container>
        <div className="text-center text-sm text-gray-400">
          <p>&copy; 2026 UNO Multiplayer. All rights reserved.</p>
        </div>
      </Container>
    </footer>
  );
}
