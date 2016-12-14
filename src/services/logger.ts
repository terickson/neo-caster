import winston = require('winston');
import {LoggerSettings} from './loggerSettings';

let log = new (winston.Logger)({transports: [
    new winston.transports.Console((new LoggerSettings('console')).loggingFormat)
  ]});

export const logger = log;
