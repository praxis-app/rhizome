import { PERMISSION_KEYS } from '../constants/role.constants';

type AbilityAction = 'delete' | 'create' | 'read' | 'update' | 'manage';

type AbilitySubject =
  | 'ServerConfig'
  | 'Channel'
  | 'Invite'
  | 'Message'
  | 'Role'
  | 'all';

export interface Role {
  id: string;
  name: string;
  color: string;
  permissions: any[];
}

export interface Permission {
  subject: AbilitySubject;
  action: AbilityAction[];
}

export interface CreateRoleReq {
  name: string;
  color: string;
}

export interface UpdateRolePermissionsReq {
  permissions: Permission[];
}

export type PermissionKeys = (typeof PERMISSION_KEYS)[number];
