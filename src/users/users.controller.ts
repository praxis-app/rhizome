import { Request, Response } from 'express';

class UsersController {
  async getCurrentUser(_req: Request, res: Response) {
    const { id, name, status } = res.locals.user;
    res.json({ user: { id, name, status } });
  }
}

export const usersController = new UsersController();
