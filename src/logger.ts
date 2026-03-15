import pino, { type LoggerOptions } from 'pino';

const isDevelopment = process.env.NODE_ENV === 'development';

// 1. Basic configuration
const pinoOptions: LoggerOptions = {
  level: isDevelopment ? 'trace' : 'info',
};

// 2. Add transport only for development environment
if (isDevelopment) {
  pinoOptions.transport = {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'HH:MM:ss Z',
      ignore: 'pid,hostname',
    },
  };
}

// 3. Initialize and export logger instance
const logger = pino(pinoOptions);

export default logger;