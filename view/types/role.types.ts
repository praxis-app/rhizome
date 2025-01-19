import { PERMISSION_NAMES } from '../constants/role.constants';

export type AbilityAction = 'delete' | 'create' | 'read' | 'update';

export type PermissionsMap = Record<string, AbilityAction[]>;

export type PermissionName = (typeof PERMISSION_NAMES)[number];

export interface Role {
  id: string;
  name: string;
  color: string;
  permissions: any[];
}

export interface CreateRoleReq {
  name: string;
  color: string;
}

export interface UpdateRolePermissionsReq {
  permissions: PermissionsMap;
}
