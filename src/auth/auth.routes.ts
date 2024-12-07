import express from 'express';
import { authService } from './auth.service';

export const authRouter = express.Router();

authRouter.use(authService.authenticateUser);

authRouter.post('/', authService.validateUserRegistration, async (req, res) => {
  try {
    const token = await authService.register(req, res);
    res.json({ token });
  } catch (e: any) {
    res.status(500).send(e.message);
  }
});
