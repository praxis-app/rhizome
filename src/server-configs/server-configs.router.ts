import express from 'express';
import { authenticate } from '../auth/middleware/authenticate.middleware';
import { validateConnectBot } from './middleware/validate-connect-bot.middleware';
import {
  connectBot,
  getServerConfig,
  updateServerConfig,
} from './server-configs.controller';

export const serverConfigsRouter = express.Router();

serverConfigsRouter
  .use(authenticate)
  .get('/', getServerConfig)
  .put('/', updateServerConfig)
  .post('/connect-bot', validateConnectBot, connectBot);
