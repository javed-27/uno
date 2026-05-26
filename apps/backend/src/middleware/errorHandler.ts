/**
 * Express error handling middleware
 */

import { NextFunction, Request, Response } from "express";
import { logger } from "../logger";

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = "AppError";
  }
}

/**
 * Error handling middleware (must be last)
 */
export function errorHandler(
  err: Error | AppError,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void {
  logger.error("Error:", {
    message: err.message,
    stack: err.stack,
  });

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: err.message,
      statusCode: err.statusCode,
    });
    return;
  }

  // Default server error
  res.status(500).json({
    error: "Internal Server Error",
    statusCode: 500,
  });
}
