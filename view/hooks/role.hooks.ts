import { createMongoAbility } from '@casl/ability';
import { AppAbility } from '../types/role.types';
import { useMeQuery } from './user.hooks';

export const useAbility = () => {
  const { data } = useMeQuery();
  const permissions = data?.user.permissions ?? [];
  const ability = createMongoAbility<AppAbility>(permissions);
  return ability;
};
