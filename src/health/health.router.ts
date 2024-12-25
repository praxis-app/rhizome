import express from 'express';
import { healthController } from './health.controller';

export const healthRouter = express.Router();

healthRouter.get('/', healthController.getHealth);
