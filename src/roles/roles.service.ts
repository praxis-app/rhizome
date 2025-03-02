import { RawRuleOf } from '@casl/ability';
import { In, Not } from 'typeorm';
import { sanitizeText } from '../common/common.utils';
import { dataSource } from '../database/data-source';
import { User } from '../users/user.entity';
import { AbilityAction, AbilitySubject, AppAbility } from './app-ability';
import { CHANNEL_ACCESS_MAP } from './channel-access';
import { Permission } from './models/permission.entity';
import { Role } from './models/role.entity';

export const DEFAULT_ROLE_COLOR = '#f44336';
export const ADMIN_ROLE_NAME = 'admin';

type PermissionMap = Record<string, AbilityAction[]>;

interface CreateRoleReq {
  name: string;
  color: string;
}

interface UpdateRolePermissionsReq {
  permissions: RawRuleOf<AppAbility>[];
}

const userRepository = dataSource.getRepository(User);
const roleRepository = dataSource.getRepository(Role);
const permissionRepository = dataSource.getRepository(Permission);

export const getRole = async (roleId: string) => {
  const role = await roleRepository.findOne({
    where: { id: roleId },
    relations: ['permissions'],
  });
  if (!role) {
    throw new Error('Role not found');
  }
  const members = await userRepository.find({
    where: { roles: { id: roleId } },
    select: ['id', 'name', 'displayName'],
  });
  const permissions = buildPermissionRules([role]);

  return { ...role, permissions, members };
};

export const getRoles = async () => {
  const roles = await dataSource
    .createQueryBuilder()
    .select('role.id', 'id')
    .addSelect('role.name', 'name')
    .addSelect('role.color', 'color')
    .addSelect('COUNT(member.id)', 'memberCount')
    .from(Role, 'role')
    .leftJoin('role.members', 'member')
    .groupBy('role.id')
    .orderBy('role.updatedAt', 'DESC')
    .getRawMany<Role & { memberCount: string }>();

  return roles.map((role) => ({
    ...role,
    memberCount: parseInt(role.memberCount),
  }));
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
  return buildPermissionRules(roles);
};

export const getUsersEligibleForRole = async (roleId: string) => {
  const role = await roleRepository.findOne({
    where: { id: roleId },
    relations: ['members'],
  });
  if (!role) {
    throw new Error('Role not found');
  }
  const userIds = role.members.map(({ id }) => id);
  return userRepository.find({
    where: {
      id: Not(In(userIds)),
      anonymous: false,
      locked: false,
    },
    select: ['id', 'name', 'displayName'],
  });
};

export const createRole = async ({ name, color }: CreateRoleReq) => {
  const role = await roleRepository.save({ name, color });
  return { ...role, memberCount: 0 };
};

export const createAdminRole = async (userId: string) => {
  await roleRepository.save({
    name: ADMIN_ROLE_NAME,
    color: DEFAULT_ROLE_COLOR,
    members: [{ id: userId }],
    permissions: [
      { subject: 'ServerConfig', action: 'manage' },
      { subject: 'Channel', action: 'manage' },
      { subject: 'Invite', action: 'create' },
      { subject: 'Invite', action: 'manage' },
      { subject: 'Role', action: 'manage' },
    ],
  });
};

export const updateRole = async (
  id: string,
  { name, color }: CreateRoleReq,
) => {
  const sanitizedName = sanitizeText(name);
  const sanitizedColor = sanitizeText(color);

  return roleRepository.update(id, {
    name: sanitizedName,
    color: sanitizedColor,
  });
};

export const updateRolePermissions = async (
  roleId: string,
  { permissions }: UpdateRolePermissionsReq,
) => {
  const role = await roleRepository.findOne({
    where: { id: roleId },
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

export const addRoleMembers = async (roleId: string, userIds: string[]) => {
  const role = await roleRepository.findOne({
    where: { id: roleId },
    relations: ['members'],
  });
  if (!role) {
    throw new Error('Role not found');
  }
  const newMembers = await userRepository.find({
    where: {
      id: In(userIds),
      anonymous: false,
      locked: false,
    },
  });
  return roleRepository.save({
    ...role,
    members: [...role.members, ...newMembers],
  });
};

export const removeRoleMember = async (roleId: string, userId: string) => {
  const role = await roleRepository.findOne({
    where: { id: roleId },
    relations: ['members'],
  });
  if (!role) {
    throw new Error('Role not found');
  }
  role.members = role.members.filter((member) => member.id !== userId);
  await roleRepository.save(role);
};

export const deleteRole = async (id: string) => {
  return roleRepository.delete(id);
};

/**
 * Example output:
 * `[ { subject: 'Channel', action: ['read', 'create'] } ]`
 */
const buildPermissionRules = (roles: Role[]): RawRuleOf<AppAbility>[] => {
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

/** Check if a user can access a given pub-sub channel */
export const canAccessChannel = (channelKey: string, user: User) => {
  for (const { pattern, rules } of Object.values(CHANNEL_ACCESS_MAP)) {
    const match = pattern.exec(channelKey);
    if (match) {
      return Object.values(rules).every((rule) => rule(match, user));
    }
  }
  return false;
};
