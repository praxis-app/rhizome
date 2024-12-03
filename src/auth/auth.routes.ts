import express from 'express';
import { authService } from './auth.service';

export const authRouter = express.Router();

authRouter.use(authService.authenticateUser);

authRouter.post('/', async (_, res) => {
  console.log('POST /auth');
  const token = await authService.register(res);
  res.json({ token });
});
