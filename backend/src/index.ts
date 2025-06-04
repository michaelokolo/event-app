import express, { Response, Request } from 'express';

const app = express();
const port = 3000;

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World! My first TypeScript Express app');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
