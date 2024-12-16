import { Request, Response } from 'express';
import { getUploadsPath } from './images.utils';
import { imagesService } from './images.service';

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
}

export const imagesController = new ImagesController();
