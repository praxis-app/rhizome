export interface Invite {
  id: string;
  token: string;
  uses: number;
  maxUses?: number;
  user: {
    id: string;
    name: string;
  };
  expiresAt?: string;
  createdAt: string;
}

export interface CreateInviteReq {
  maxUses?: number;
  expiresAt?: Date;
}
