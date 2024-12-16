import express from 'express';
import multer from 'multer';
import { authService } from '../auth/auth.service';
import {
  MAX_IMAGE_COUNT,
  MAX_IMAGE_SIZE,
  VALID_IMAGE_FORMAT,
} from './image.constants';
import { imagesController } from './images.controller';
import { getUploadsPath } from './images.utils';

export const imagesRouter = express.Router();

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, getUploadsPath());
  },
  filename: (_req, file, callback) => {
    const extension = file.mimetype.split('/')[1];
    callback(null, `${Date.now()}.${extension}`);
  },
});

const fileFilter = (_req: any, file: Express.Multer.File, cb: any) => {
  const extension = file.mimetype.split('/')[1];
  if (extension.match(VALID_IMAGE_FORMAT)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  limits: { fileSize: MAX_IMAGE_SIZE },
  fileFilter,
  storage,
});

const multiImageUpload = upload.array('images', MAX_IMAGE_COUNT);

imagesRouter.use(authService.authenticateUser);
imagesRouter.get('/:id', imagesController.getImageFile);
imagesRouter.post('/', multiImageUpload, imagesController.createImages);
