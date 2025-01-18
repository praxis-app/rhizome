export interface CreateRoleReq {
  name: string;
  color: string;
}

export interface Role {
  id: string;
  name: string;
  color: string;
  permissions: any[];
}
