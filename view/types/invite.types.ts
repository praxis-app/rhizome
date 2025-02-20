export interface Invite {
  id: string;
  token: string;
  uses: number;
  maxUses?: number;
  expiresAt?: string;
  createdAt: string;
}

export interface CreateInviteReq {
  maxUses?: number;
  expiresAt?: number;
}
