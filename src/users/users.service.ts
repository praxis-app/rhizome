// TODO: Add support for user updates with validation

import { colors, NumberDictionary, uniqueNamesGenerator } from 'unique-names-generator';
import * as channelsService from '../channels/channels.service';
import { normalizeText } from '../common/common.utils';
import { dataSource } from '../database/data-source';
import { User } from './user.entity';
import { NATURE_DICTIONARY, SPACE_DICTIONARY } from './users.constants';

const userRepository = dataSource.getRepository(User);

export const signUp = async (email: string, name: string | undefined, password: string) => {
  const user = await userRepository.save({
    name: name?.trim() || generateName(),
    email: normalizeText(email),
    password,
  });
  await channelsService.addMemberToGeneralChannel(user.id);
  return user;
};

export const upgradeAnonUser = async (userId: string, email: string, password: string) => {
  const user = await userRepository.findOne({
    where: { id: userId },
  });
  if (!user) {
    throw new Error('User not found');
  }
  // Upgrade existing anon user to a registered user
  await userRepository.update(userId, {
    ...user,
    anonymous: false,
    email: normalizeText(email),
    password,
  });
  return;
};

export const createAnonUser = async () => {
  const user = await userRepository.save({
    name: generateName(),
    anonymous: true,
  });
  await channelsService.addMemberToGeneralChannel(user.id);
  return user;
};

const generateName = () => {
  const numberDictionary = NumberDictionary.generate({ min: 10, max: 99 });
  const nounDictionary = Math.random() >= 0.5 ? SPACE_DICTIONARY : NATURE_DICTIONARY;

  const name = uniqueNamesGenerator({
    dictionaries: [colors, nounDictionary, numberDictionary],
    separator: '-',
  });

  return name;
};
