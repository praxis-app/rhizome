import { Repository } from 'typeorm';
import { dataSource } from '../database/data-source';
import { deleteImageFile } from './images.utils';
import { Image } from './models/image.entity';

class ImagesService {
  private imageRepository: Repository<Image>;

  constructor() {
    this.imageRepository = dataSource.getRepository(Image);
  }

  async getImage(imageId: string) {
    return this.imageRepository.findOne({
      where: { id: imageId },
    });
  }

  async deleteImage(imageId: string) {
    const image = await this.imageRepository.findOne({
      where: { id: imageId },
      select: ['filename'],
    });
    if (!image || !image.filename) {
      throw new Error('Image not found');
    }
    await deleteImageFile(image.filename);
    this.imageRepository.delete(imageId);
  }
}

export const imagesService = new ImagesService();
