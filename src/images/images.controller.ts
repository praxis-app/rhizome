import { Request, Response } from 'express';
import { imagesService } from './images.service';
import { getUploadsPath } from './images.utils';

class ImagesController {
  async getImageFile(req: Request, res: Response) {
    const { id, messageId } = req.params;
    const image = await imagesService.getImage({ id, messageId });

    if (!image) {
      res.status(404).send('Image not found');
      return;
    }

    return res.sendFile(image.filename, {
      root: getUploadsPath(),
    });
  }

  async createImages(req: Request, res: Response) {
    if (!req.files) {
      res.status(400).send('No images uploaded');
      return;
    }

    const { messageId } = req.params;
    const files = req.files as Express.Multer.File[];
    const images = await imagesService.createImages(messageId, files);

    res.status(201).json(images);
  }
}

export const imagesController = new ImagesController();
