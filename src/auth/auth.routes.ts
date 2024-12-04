import express from 'express';
import { authService } from './auth.service';
import { validate as uuidValidate } from 'uuid';

export const authRouter = express.Router();

authRouter.use(authService.authenticateUser);

authRouter.post('/', async (req, res) => {
  const { clientId } = req.body;
  if (!clientId || !uuidValidate(clientId)) {
    res.status(400).send('Invalid client ID');
    return;
  }
  const token = await authService.register(res);
  res.json({ token });
});
