import multer from 'multer';
import {
  MAX_IMAGE_COUNT,
  MAX_IMAGE_SIZE,
  VALID_IMAGE_FORMAT,
} from '../image.constants';
import { getUploadsPath } from '../images.utils';

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

export const uploadImages = upload.array('images', MAX_IMAGE_COUNT);
