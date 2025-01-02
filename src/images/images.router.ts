// TODO: Guard routes with permission checks

import express from 'express';
import { imagesController } from './images.controller';

export const imagesRouter = express.Router();

imagesRouter.get('/:id', imagesController.getImageFile);
