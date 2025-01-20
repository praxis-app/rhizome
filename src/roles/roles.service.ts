import { RawRuleOf } from '@casl/ability';
import { dataSource } from '../database/data-source';
import { AbilityAction, AbilitySubject, AppAbility } from './app-ability';
import { Permission } from './models/permission.entity';
import { Role } from './models/role.entity';

type PermissionMap = Record<string, AbilityAction[]>;

interface CreateRoleReq {
  name: string;
  color: string;
}

interface UpdateRolePermissionsReq {
  permissions: RawRuleOf<AppAbility>[];
}

const roleRepository = dataSource.getRepository(Role);
const permissionRepository = dataSource.getRepository(Permission);

export const getRole = async (id: string) => {
  const role = await roleRepository.findOne({
    where: { id },
    relations: ['permissions'],
  });
  if (!role) {
    throw new Error('Role not found');
  }

  const permissionMap = buildPermissionMap([role]);
  const permissions = mapPermissionsToRules(permissionMap);

  return { ...role, permissions };
};

export const getRoles = async () => {
  return roleRepository.find({
    order: { updatedAt: 'DESC' },
  });
};

/**
 * Returns permissions for a given user
 *
 * Example output:
 * `[ { subject: 'Channel', action: ['read', 'create'] } ]`
 */
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
  const permissionMap = buildPermissionMap(roles);
  return mapPermissionsToRules(permissionMap);
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

  const permissionsToSave = permissions.reduce<Partial<Permission>[]>(
    (result, { action, subject }) => {
      const actions = Array.isArray(action) ? action : [action];

      for (const a of actions) {
        result.push({
          subject: subject as AbilitySubject,
          action: a,
          role,
        });
      }
      return result;
    },
    [],
  );

  const permissionsToDelete = role.permissions.reduce<string[]>(
    (result, currentPermission) => {
      const found = permissions.find(
        (p) =>
          p.subject === currentPermission.subject &&
          p.action.includes(currentPermission.action),
      );
      if (!found) {
        result.push(currentPermission.id);
      }
      return result;
    },
    [],
  );

  if (permissionsToDelete.length) {
    await permissionRepository.delete(permissionsToDelete);
  }
  await permissionRepository.save(permissionsToSave);
};

export const deleteRole = async (id: string) => {
  return roleRepository.delete(id);
};

const buildPermissionMap = (roles: Role[]) => {
  return roles.reduce<PermissionMap>((result, role) => {
    for (const permission of role.permissions) {
      if (!result[permission.subject]) {
        result[permission.subject] = [];
      }
      result[permission.subject].push(permission.action);
    }
    return result;
  }, {});
};

const mapPermissionsToRules = (
  permissions: PermissionMap,
): RawRuleOf<AppAbility>[] => {
  return Object.entries(permissions).map(([subject, action]) => ({
    subject: subject as AbilitySubject,
    action,
  }));
};
