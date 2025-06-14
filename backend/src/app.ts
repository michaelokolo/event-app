import express from 'express';
import cookieParser from 'cookie-parser';
import authRouter from './routes/api/auth';
import userRouter from './routes/api/user';
import adminRouter from './routes/api/admin';
import {
  generalErrorHandler,
  prismaErrorHandler,
} from './middleware/errorHandling';

const app = express();
app.use(cookieParser());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/admin', adminRouter);

app.use(prismaErrorHandler);
app.use(generalErrorHandler);

export default app;
