import express from 'express';
import { authService } from './auth.service';
import { validate as uuidValidate } from 'uuid';

export const authRouter = express.Router();

authRouter.use(authService.authenticateUser);

authRouter.post('/', async (req, res) => {
  try {
    const { clientId } = req.body;
    if (!clientId || !uuidValidate(clientId)) {
      res.status(400).send('Invalid client ID');
      return;
    }
    const token = await authService.register(req, res);
    res.json({ token });
  } catch (e: any) {
    res.status(500).send(e.message);
  }
});
