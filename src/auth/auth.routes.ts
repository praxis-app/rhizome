import express from 'express';
import { authService } from './auth.service';

export const authRouter = express.Router();

authRouter.post('/', async (_, res) => {
  const token = await authService.register();
  res.json({ token });
});
