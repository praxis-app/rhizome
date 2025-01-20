import { PERMISSION_NAMES } from '../constants/role.constants';

type AbilityAction = 'delete' | 'create' | 'read' | 'update';
type AbilitySubject = 'Channel' | 'Message' | 'Role' | 'all';

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

export type PermissionName = (typeof PERMISSION_NAMES)[number];
