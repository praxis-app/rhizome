import { Request, Response } from 'express';
import { authService } from './auth.service';

class AuthController {
  async upgrade(req: Request, res: Response) {
    const { user } = res.locals;
    await authService.upgrade(user.id, req.body);
    res.sendStatus(204);
  }

  async registerAnon(req: Request, res: Response) {
    const { clientId } = req.body;
    const token = await authService.registerAnon(clientId);
    res.json({ token });
  }
}

export const authController = new AuthController();
