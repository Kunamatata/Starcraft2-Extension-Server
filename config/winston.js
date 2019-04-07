const path = require('path');
const { transports, format, createLogger } = require('winston');

const {
  combine, timestamp, json,
} = format;

const logger = createLogger({
  level: 'info',
  format: combine(timestamp(), json()),
  defaultMeta: { service: 'user-service' },
  transports: [
    new transports.File({ filename: path.join(__dirname, '../logs/combined.log') }),
  ],
});

module.exports = logger;
