export enum UserStatus {
  ANONYMOUS = 'anonymous',
  UNVERIFIED = 'unverified',
  VERIFIED = 'verified',
  BANNED = 'banned',
}

export interface CurrentUser {
  id: string;
  name: string;
  status: UserStatus;
}
