import { User } from '../users/user.entity';

interface ChannelAccessRule {
  pattern: RegExp;
  validate: (match: RegExpExecArray, user: User) => boolean;
}

const channelAccessRules: ChannelAccessRule[] = [
  {
    pattern: /^channel-(\w+)-(\w+)$/,
    validate: (match, user) => {
      const userId = match[2];
      return user.id === userId;
    },
  },
];

export const canAccessChannel = (channelKey: string, user: User): boolean => {
  for (const rule of channelAccessRules) {
    const match = rule.pattern.exec(channelKey);
    if (match) {
      return rule.validate(match, user);
    }
  }
  return false;
};
