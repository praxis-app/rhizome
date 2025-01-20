import { Permission } from './role.types';

export interface CurrentUser {
  id: string;
  name: string;
  anonymous: boolean;
  permissions: Permission[];
}
