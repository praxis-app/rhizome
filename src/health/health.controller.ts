import { Request, Response } from 'express';
import { healthService } from './health.service';

class HealthController {
  async getHealth(_: Request, res: Response) {
    const payload = healthService.getHealth();
    res.json(payload);
  }
}

export const healthController = new HealthController();
