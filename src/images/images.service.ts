import { FindOptionsWhere, Repository } from 'typeorm';
import { dataSource } from '../database/data-source';
import { deleteImageFile } from './images.utils';
import { Image } from './models/image.entity';

class ImagesService {
  private imageRepository: Repository<Image>;

  constructor() {
    this.imageRepository = dataSource.getRepository(Image);
  }

  async getImage(where: FindOptionsWhere<Image>) {
    return this.imageRepository.findOne({ where });
  }

  async createImages(messageId: string, files: Express.Multer.File[]) {
    const imageFilenames = files.map((file) => file.filename);
    const images = imageFilenames.map((filename) =>
      this.imageRepository.create({ messageId, filename }),
    );
    return this.imageRepository.save(images);
  }

  async deleteImage(imageId: string) {
    const image = await this.imageRepository.findOne({
      where: { id: imageId },
      select: ['filename'],
    });
    if (!image) {
      return;
    }
    await deleteImageFile(image.filename);
    this.imageRepository.delete(imageId);
  }
}

export const imagesService = new ImagesService();
