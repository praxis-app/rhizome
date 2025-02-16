import { User } from '../users/user.entity';

interface ChannelAccessRule {
  pattern: RegExp;
  validate: (match: RegExpExecArray, user: User) => boolean;
}

const UUID_REGEX =
  '[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}';

/** Rules to determine if a user can access a given pub-sub channel */
export const CHANNEL_ACCESS_RULES: ChannelAccessRule[] = [
  {
    pattern: new RegExp(`^channel-(${UUID_REGEX})-(${UUID_REGEX})$`),
    validate: (match, user) => {
      const userId = match[2];
      return user.id === userId;
    },
  },
];
