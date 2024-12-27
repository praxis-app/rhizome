import express from 'express';
import { authService } from '../auth/auth.service';
import { imagesController } from './images.controller';

export const imagesRouter = express.Router();

imagesRouter.use(authService.authenticate);
imagesRouter.get('/:id', imagesController.getImageFile);
