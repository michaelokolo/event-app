import express, { Response, Request } from 'express';

const app = express();

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World! My first TypeScript Express app');
});

export default app;
