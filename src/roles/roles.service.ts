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
  const permissions = mapRolesToRules([role]);
  return { ...role, permissions };
};

export const getRoles = async () => {
  return roleRepository.find({
    order: { updatedAt: 'DESC' },
  });
};

/** Get permissions from assigned roles */
export const getUserPermissions = async (
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
  return mapRolesToRules(roles);
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
        // Account for existing permissions
        const permission = role.permissions.find(
          (p) => p.subject === subject && p.action === a,
        );
        result.push({
          id: permission?.id,
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

export const addRoleMembers = async (id: string, userIds: string[]) => {
  const role = await roleRepository.findOne({
    where: { id },
    relations: ['members'],
  });
  if (!role) {
    throw new Error('Role not found');
  }
  const membersToAdd = userIds.filter(
    (id) => !role.members.some((member) => member.id === id),
  );
  return roleRepository.save({
    ...role,
    members: membersToAdd.map((id) => ({ id })),
  });
};

export const deleteRole = async (id: string) => {
  return roleRepository.delete(id);
};

/**
 * Example output:
 * `[ { subject: 'Channel', action: ['read', 'create'] } ]`
 */
const mapRolesToRules = (roles: Role[]): RawRuleOf<AppAbility>[] => {
  const permissionMap = roles.reduce<PermissionMap>((result, role) => {
    for (const permission of role.permissions) {
      if (!result[permission.subject]) {
        result[permission.subject] = [];
      }
      result[permission.subject].push(permission.action);
    }
    return result;
  }, {});

  return Object.entries(permissionMap).map(([subject, action]) => ({
    subject: subject as AbilitySubject,
    action,
  }));
};
