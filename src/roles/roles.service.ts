import { RawRuleOf } from '@casl/ability';
import { dataSource } from '../database/data-source';
import { AbilityAction, AbilitySubject, AppAbility } from './app-ability';
import { Permission } from './models/permission.entity';
import { Role } from './models/role.entity';

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
const permissionRepository = dataSource.getRepository(Permission);

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

  const permissionsToSave = Object.entries(permissions).flatMap(
    ([subject, actions]) =>
      actions.map((action) => {
        const existingPerm = role.permissions.find(
          (p) => p.subject === subject && p.action === action,
        );
        return {
          id: existingPerm?.id,
          subject: subject as AbilitySubject,
          action,
          role,
        };
      }),
  );
  const permissionsToDelete = role.permissions.reduce<string[]>(
    (result, permission) => {
      if (
        !permissions[permission.subject] ||
        !permissions[permission.subject].includes(permission.action)
      ) {
        result.push(permission.id);
      }
      return result;
    },
    [],
  );

  await permissionRepository.save(permissionsToSave);
  await permissionRepository.delete(permissionsToDelete);
};

export const deleteRole = async (id: string) => {
  return roleRepository.delete(id);
};
