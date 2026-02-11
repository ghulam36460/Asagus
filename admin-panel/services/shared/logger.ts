/**
 * Simple logger utility for production-ready logging
 * Replace console.log statements with structured logging
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogOptions {
  context?: string;
  metadata?: Record<string, unknown>;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  private formatMessage(level: LogLevel, message: string, options?: LogOptions): string {
    const timestamp = new Date().toISOString();
    const context = options?.context ? `[${options.context}]` : '';
    const metadata = options?.metadata ? ` ${JSON.stringify(options.metadata)}` : '';
    return `${timestamp} [${level.toUpperCase()}] ${context} ${message}${metadata}`;
  }

  info(message: string, options?: LogOptions): void {
    if (this.isDevelopment) {
      console.log(this.formatMessage('info', message, options));
    }
  }

  warn(message: string, options?: LogOptions): void {
    console.warn(this.formatMessage('warn', message, options));
  }

  error(message: string, error?: unknown, options?: LogOptions): void {
    const errorMetadata = error instanceof Error 
      ? { error: error.message, stack: error.stack, ...options?.metadata }
      : { error: String(error), ...options?.metadata };
    
    console.error(this.formatMessage('error', message, { ...options, metadata: errorMetadata }));
  }

  debug(message: string, options?: LogOptions): void {
    if (this.isDevelopment) {
      console.debug(this.formatMessage('debug', message, options));
    }
  }
}

export const logger = new Logger();
