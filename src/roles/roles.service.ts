import { RawRuleOf } from '@casl/ability';
import { dataSource } from '../database/data-source';
import { AppAbility } from './create-ability.util';
import { Role } from './models/role.entity';
import { AbilityAction, AbilitySubject } from './models/role.types';

type PermissionsMap = Record<string, AbilityAction[]>;

interface CreateRoleReq {
  name: string;
  color: string;
}

const roleRepository = dataSource.getRepository(Role);

export const getRole = async (id: string) => {
  return roleRepository.findOne({
    where: { id },
    relations: ['permissions'],
  });
};

export const getRoles = async () => {
  return roleRepository.find({
    order: { updatedAt: 'DESC' },
  });
};

export const createRole = async ({ name, color }: CreateRoleReq) => {
  return roleRepository.save({ name, color });
};

// TODO: Uncomment when no longer needed
// const testRules: RawRuleOf<AppAbility>[] = [
//   { action: ['read', 'create'], subject: 'Channel' },
// ];

export const getUserPermisions = async (
  userId: string,
): Promise<RawRuleOf<AppAbility>[]> => {
  const roles = await roleRepository.find({
    relations: ['permissions'],
    where: {
      members: {
        id: userId,
      },
    },
  });

  const permissionsMap = roles.reduce<PermissionsMap>((result, role) => {
    for (const permission of role.permissions) {
      if (!result[permission.subject]) {
        result[permission.subject] = [];
      }
      result[permission.subject].push(permission.action);
    }
    return result;
  }, {});

  const permissions = Object.entries(permissionsMap).map(
    ([subject, actions]) => ({
      subject: subject as AbilitySubject,
      action: actions,
    }),
  );

  return permissions;
};
