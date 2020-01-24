import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (
  process.env.NODE_ENV !== 'production' ||
  process.env.NODE_ENV !== 'HEROKU'
) {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  );
}

// eslint-disable-next-line import/prefer-default-export
export { logger };
