import { Request, Response } from 'express';
import { authService } from './auth.service';

class AuthController {
  async registerAnon(req: Request, res: Response) {
    try {
      const { clientId } = req.body;
      const token = await authService.registerAnon(clientId);
      res.json({ token });
    } catch (e: any) {
      res.status(500).send(e.message);
    }
  }
}

export const authController = new AuthController();
