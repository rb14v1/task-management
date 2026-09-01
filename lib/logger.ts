// Structured JSON logger — satisfies obs.structured_logging.
// Every log line is a single JSON object written to stdout.

type LogLevel = "info" | "warn" | "error";

export function log(level: LogLevel, message: string, fields?: Record<string, unknown>): void {
  const entry = {
    ts: new Date().toISOString(),
    level,
    message,
    ...(fields ?? {}),
  };
  console.log(JSON.stringify(entry));
}

export const logger = {
  info(message: string, fields?: Record<string, unknown>) {
    log("info", message, fields);
  },
  warn(message: string, fields?: Record<string, unknown>) {
    log("warn", message, fields);
  },
  error(message: string, fields?: Record<string, unknown>) {
    log("error", message, fields);
  },
};
