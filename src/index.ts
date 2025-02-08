import mongoose from 'mongoose';
import logger from './config/logger.js';
import app from './app.js';
import config from './config/config.js';

let server: any;

mongoose
    .connect(config.MONGODB_URI)
    .then(() => {
        logger.info('MongoDB connected successfully');
        server = app.listen(config.PORT, () => {
            logger.info(`Server is running on port ${config.PORT}: http://localhost:${config.PORT}`);
        });
    })
    .catch((err) => {
        logger.error(err);
        process.exit(1);
    });

const exitHandler = () => {
    if (server) {
        server.close(() => {
            logger.info('Server closed');
            process.exit(1);
        });
    } else {
        process.exit(1);
    }
};

const unexpectedErrorHandler = (err: string) => {
    logger.error(err);
    exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
    logger.info('SIGTERM received');
    if (server) {
        server.close(() => {
            logger.info('Server closed');
        });
    }
});
