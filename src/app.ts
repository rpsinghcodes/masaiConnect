import express, { NextFunction, Request, Response } from 'express';
import mongoSanitize from 'express-mongo-sanitize';
import compression from 'compression';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import cookieparser from 'cookie-parser';
import config from './config/config.js';
import errorHandler from './utils/error.js';
import router from './routes/index.js';

const app = express();

app.use(morgan(config.NODE_ENV === 'development' ? 'dev' : 'combined'));

// set security HTTP headers
app.use(helmet());
app.use(cookieparser());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request body to prevent MongoDB sql injection
app.use(mongoSanitize());

// compress response to improve performance
app.use(compression());

// enable CORS
app.use(cors());
app.options('*', cors());

// ==================== Routes ====================
app.use('/api/v1', router);

app.use(errorHandler as (err: any, req: Request, res: Response, next: NextFunction) => void);

// send back a 404 error for any unknown api request
app.use((_err: Error, _req: Request, res: Response, _next: NextFunction) => {
    res.status(404).json({ error: 'Route Not Found' });
});

export default app;
