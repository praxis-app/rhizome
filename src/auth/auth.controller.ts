import { Request, Response } from 'express';
import { authService } from './auth.service';

class AuthController {
  async signUp(req: Request, res: Response) {
    const { user } = res.locals;
    await authService.signUp(user.id, req.body);
    res.sendStatus(204);
  }

  async createAnon(req: Request, res: Response) {
    const { clientId } = req.body;
    const token = await authService.createAnon(clientId);
    res.json({ token });
  }
}

export const authController = new AuthController();
