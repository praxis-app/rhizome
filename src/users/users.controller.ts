import { Request, Response } from 'express';

class UsersController {
  async getCurrentUser(_req: Request, res: Response) {
    const { id, name } = res.locals.user;
    res.json({ user: { id, name } });
  }
}

export const usersController = new UsersController();
