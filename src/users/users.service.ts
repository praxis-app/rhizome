// TODO: Add support for user updates with validation

import { Repository } from 'typeorm';
import { colors, NumberDictionary, uniqueNamesGenerator } from 'unique-names-generator';
import { channelsService } from '../channels/channels.service';
import { dataSource } from '../database/data-source';
import { User, UserStatus } from './user.entity';
import { NATURE_DICTIONARY, SPACE_DICTIONARY } from './users.constants';
import { normalizeText } from '../common/common.utils';

class UsersService {
  private userRepository: Repository<User>;

  constructor() {
    this.userRepository = dataSource.getRepository(User);
  }

  signUp = async (userId: string, email: string, password: string) => {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new Error('User not found');
    }

    await this.userRepository.update(userId, {
      ...user,
      status: UserStatus.UNVERIFIED,
      email: normalizeText(email),
      password,
    });
  };

  createAnonUser = async (clientId: string) => {
    const name = await this.generateName();
    const user = await this.userRepository.save({ clientId, name });
    await channelsService.addMemberToGeneralChannel(user.id);
    return user;
  };

  generateName = async () => {
    const numberDictionary = NumberDictionary.generate({ min: 10, max: 99 });
    const nounDictionary = Math.random() >= 0.5 ? SPACE_DICTIONARY : NATURE_DICTIONARY;

    const name = uniqueNamesGenerator({
      dictionaries: [colors, nounDictionary, numberDictionary],
      separator: '-',
    });

    return name;
  };
}

export const usersService = new UsersService();
