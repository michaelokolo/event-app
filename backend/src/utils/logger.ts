import { createLogger, format, transports } from 'winston';
import path from 'path';

const isProduction = process.env.NODE_ENV === 'production';

const logger = createLogger({
  level: isProduction ? 'info' : 'debug',
  format: format.combine(
    format.timestamp(),
    isProduction ? format.json() : format.colorize(),
    format.printf(({ level, message, timestamp }) => {
      return `[${timestamp}] ${level}: ${message}`;
    })
  ),
  transports: [
    new transports.Console(),
    ...(isProduction
      ? [
          new transports.File({
            filename: path.join('logs', 'error.log'),
            level: 'error',
          }),
          new transports.File({
            filename: path.join('logs', 'app.log'),
          }),
        ]
      : []),
  ],
});

export const winstonStream = {
  write: (message: string) => {
    logger.http(message.trim());
  },
};

export default logger;
