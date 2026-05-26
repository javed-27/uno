/**
 * Centralized configuration and environment validation
 */

interface Config {
  port: number;
  nodeEnv: "development" | "production" | "test";
  cors: {
    origin: string | string[];
  };
}

function validateEnv(): Config {
  const port = parseInt(process.env.PORT || "4000", 10);
  const nodeEnv = (process.env.NODE_ENV || "development") as Config["nodeEnv"];

  if (!port || port < 1 || port > 65535) {
    throw new Error("Invalid PORT: must be a number between 1 and 65535");
  }

  const corsOrigin = process.env.CORS_ORIGIN || "*";

  return {
    port,
    nodeEnv,
    cors: {
      origin: corsOrigin === "*" ? "*" : corsOrigin.split(","),
    },
  };
}

export const config = validateEnv();
