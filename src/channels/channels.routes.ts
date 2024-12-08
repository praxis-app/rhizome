import express from 'express';
import { channelsController } from './channels.controller';

export const channelsRouter = express.Router();

channelsRouter.get('/', channelsController.getChannels);
