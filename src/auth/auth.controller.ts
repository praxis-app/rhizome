import { Request, Response } from 'express';
import { authService } from './auth.service';

class AuthController {
  async signUp(req: Request, res: Response) {
    const token = await authService.signUp(req.body);
    res.json({ token });
  }

  async createAnonSession(_req: Request, res: Response) {
    const token = await authService.createAnonSession();
    res.json({ token });
  }

  async upgradeAnonSession(req: Request, res: Response) {
    const { user } = res.locals;
    await authService.upgradeAnonSession(req.body, user.id);
    res.sendStatus(204);
  }

  async logOut(_req: Request, res: Response) {
    res.setHeader('Clear-Site-Data', '"storage"');
    res.sendStatus(204);
  }
}

export const authController = new AuthController();
