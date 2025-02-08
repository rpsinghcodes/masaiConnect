import winston from 'winston';
import config from './config.js';

const enumerateErrorFormat = winston.format((info) => {
    if (info instanceof Error) {
        Object.assign(info, { message: info.stack });
    }
    return info;
});

const logger = winston.createLogger({
    level: config.NODE_ENV === 'development' ? 'debug' : 'info',
    format: winston.format.combine(
        enumerateErrorFormat(),
        config.NODE_ENV === 'development' ? winston.format.colorize() : winston.format.uncolorize(),
        winston.format.timestamp(),
        winston.format.splat(),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} ${level}: ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console({ stderrLevels: ['error'] }),
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    ],
});

export default logger;

// admin,
