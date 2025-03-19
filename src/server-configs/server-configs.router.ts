import express from 'express';
import { authenticate } from '../auth/middleware/authenticate.middleware';
import {
  getServerConfig,
  updateServerConfig,
} from './server-configs.controller';

export const serverConfigsRouter = express.Router();

serverConfigsRouter
  .use(authenticate)
  .get('/', getServerConfig)
  .put('/', updateServerConfig);
