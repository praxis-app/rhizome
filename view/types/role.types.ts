export type AbilityAction = 'delete' | 'create' | 'read' | 'update';

export type PermissionsMap = Record<string, AbilityAction[]>;

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
