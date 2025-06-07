import express from 'express';
import authRouter from './routes/api/auth';
import { generalErrorHandler } from './middleware/errorHandling';

const app = express();

app.use(express.json());

app.use('/api/auth', authRouter);

app.use(generalErrorHandler);

export default app;
