import pino from 'pino';
import { config } from './config.js';

const { isProduction } = config;

const opts = isProduction
  ? {}
  : {
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
        },
      },
    };

export const logger = pino({
  level: config.logLevel,
  ...opts,
});

export const createLogger = (module, params = {}) =>
  logger.child({ ...params, ...(module ? { module } : {}) });
