import { Request, Response } from 'express';
import { usersService } from './users.service';

class UsersController {
  async getCurrentUser(_req: Request, res: Response) {
    const payload = await usersService.getCurrentUser(res.locals.user);
    res.json(payload);
  }
}

export const usersController = new UsersController();
