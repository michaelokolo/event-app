import express from 'express';
import morgan from 'morgan';
import logger, { winstonStream } from './utils/logger';
import cookieParser from 'cookie-parser';
import authRouter from './routes/api/auth';
import usersRouter from './routes/api/users';
import adminRouter from './routes/api/admin';
import {
  generalErrorHandler,
  prismaErrorHandler,
} from './middleware/errorHandling';

const app = express();

if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined', { stream: winstonStream }));
} else {
  app.use(morgan('dev'));
}

app.use(cookieParser());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/admin', adminRouter);

app.use(prismaErrorHandler);
app.use(generalErrorHandler);

export default app;
