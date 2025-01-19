import { RawRuleOf } from '@casl/ability';
import { dataSource } from '../database/data-source';
import { AppAbility } from './create-ability.util';
import { Role } from './models/role.entity';
import { AbilityAction, AbilitySubject } from './models/role.types';

// TODO: Uncomment when no longer needed
// const testRules: RawRuleOf<AppAbility>[] = [
//   { action: ['read', 'create'], subject: 'Channel' },
// ];

type PermissionsMap = Record<string, AbilityAction[]>;

interface CreateRoleReq {
  name: string;
  color: string;
}

interface UpdateRolePermissionsReq {
  permissions: PermissionsMap;
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

export const createRole = async ({ name, color }: CreateRoleReq) => {
  return roleRepository.save({ name, color });
};

export const updateRole = async (
  id: string,
  { name, color }: CreateRoleReq,
) => {
  return roleRepository.update(id, { name, color });
};

export const updateRolePermissions = async (
  id: string,
  { permissions }: UpdateRolePermissionsReq,
) => {
  const role = await roleRepository.findOne({
    where: { id },
    relations: ['permissions'],
  });
  if (!role) {
    throw new Error('Role not found');
  }

  // TODO: Uncomment when no longer needed
  console.log('permissions', permissions);
};

export const deleteRole = async (id: string) => {
  return roleRepository.delete(id);
};
