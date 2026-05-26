/**
 * Logger utility for structured logging
 */

export enum LogLevel {
  DEBUG = "DEBUG",
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR",
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: Record<string, unknown>;
}

function format(entry: LogEntry): string {
  const dataStr = entry.data ? ` | ${JSON.stringify(entry.data)}` : "";
  return `[${entry.timestamp}] [${entry.level}] ${entry.message}${dataStr}`;
}

export const logger = {
  debug: (message: string, data?: Record<string, unknown>) => {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: LogLevel.DEBUG,
      message,
      data,
    };
    // eslint-disable-next-line no-console
    console.log(format(entry));
  },

  info: (message: string, data?: Record<string, unknown>) => {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: LogLevel.INFO,
      message,
      data,
    };
    // eslint-disable-next-line no-console
    console.log(format(entry));
  },

  warn: (message: string, data?: Record<string, unknown>) => {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: LogLevel.WARN,
      message,
      data,
    };
    // eslint-disable-next-line no-console
    console.warn(format(entry));
  },

  error: (message: string, data?: Record<string, unknown>) => {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: LogLevel.ERROR,
      message,
      data,
    };
    // eslint-disable-next-line no-console
    console.error(format(entry));
  },
};
