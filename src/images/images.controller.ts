import { Request, Response } from 'express';
import { imagesService } from './images.service';
import { getUploadsPath } from './images.utils';

class ImagesController {
  async getImageFile(req: Request, res: Response) {
    const image = await imagesService.getImage(req.params.id);

    if (!image) {
      res.status(404).send('Image not found');
      return;
    }
    if (!image.filename) {
      res.status(404).send('Image has not been uploaded yet');
      return;
    }

    return res.sendFile(image.filename, {
      root: getUploadsPath(),
    });
  }
}

export const imagesController = new ImagesController();
