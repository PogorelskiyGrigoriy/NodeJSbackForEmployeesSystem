import pino, { type LoggerOptions } from 'pino';

const isDevelopment = process.env.NODE_ENV === 'development';

const pinoOptions: LoggerOptions = {
  level: process.env.LOG_LEVEL || (isDevelopment ? 'trace' : 'info'),
};

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

const logger = pino(pinoOptions);

export default logger;