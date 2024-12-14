import { Repository } from 'typeorm';
import {
  colors,
  NumberDictionary,
  uniqueNamesGenerator,
} from 'unique-names-generator';
import { dataSource } from '../database/data-source';
import { User } from './user.entity';
import { NATURE_DICTIONARY, SPACE_DICTIONARY } from './users.constants';

class UsersService {
  private userRepository: Repository<User>;

  constructor() {
    this.userRepository = dataSource.getRepository(User);
  }

  getCurrentUser = async (user: User) => {
    return {
      id: user.id,
      name: user.name,
    };
  };

  createUser = async (clientId: string) => {
    const name = await this.generateName();
    return this.userRepository.save({
      clientId,
      name,
    });
  };

  generateName = async () => {
    const numberDictionary = NumberDictionary.generate({
      min: 10,
      max: 99,
    });

    const nounDictionary =
      Math.random() >= 0.5 ? SPACE_DICTIONARY : NATURE_DICTIONARY;

    const name = uniqueNamesGenerator({
      dictionaries: [colors, nounDictionary, numberDictionary],
      separator: '-',
    });

    return name;
  };
}

export const usersService = new UsersService();
