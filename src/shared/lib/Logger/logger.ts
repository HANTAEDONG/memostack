interface Logger {
  info: (message: string, data?: unknown) => void;
  error: (message: string, error?: Error | unknown, data?: unknown) => void;
  warn: (message: string, data?: unknown) => void;
  debug: (message: string, data?: unknown) => void;
}

class ConsoleLogger implements Logger {
  private formatMessage(level: string, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] ${level}: ${message}`;
  }
  info(message: string, data?: unknown): void {
    console.log(this.formatMessage("INFO", message), data || "");
  }
  error(message: string, error?: Error | unknown, data?: unknown): void {
    console.error(this.formatMessage("ERROR", message), {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      data,
    });
  }
  warn(message: string, data?: unknown): void {
    console.warn(this.formatMessage("WARN", message), data || "");
  }
  debug(message: string, data?: unknown): void {
    if (process.env.NODE_ENV === "development") {
      console.debug(this.formatMessage("DEBUG", message), data || "");
    }
  }
}

export const logger: Logger = new ConsoleLogger();
