import { Request, Response } from 'express';
export default function login(req: Request, res: Response) {
  res.status(200).json('Login successful');
}
