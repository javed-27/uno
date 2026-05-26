import express from "express";
import { errorHandler } from "./middleware/errorHandler";
import { logger } from "./logger";

export function createApp() {
  const app = express();

  // Middleware
  app.use(express.json());

  // Logging middleware
  app.use((req, res, next) => {
    logger.debug(`${req.method} ${req.path}`);
    next();
  });

  // Routes
  app.get("/health", (req, res) => {
    res.json({ ok: true });
  });

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({ error: "Not Found" });
  });

  // Error handler (must be last)
  app.use(errorHandler);

  return app;
}
