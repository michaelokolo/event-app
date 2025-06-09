import express from 'express';
import authRouter from './routes/api/auth';
import {
  generalErrorHandler,
  prismaErrorHandler,
} from './middleware/errorHandling';

const app = express();

app.use(express.json());

app.use('/api/auth', authRouter);

app.use(prismaErrorHandler);
app.use(generalErrorHandler);

export default app;
