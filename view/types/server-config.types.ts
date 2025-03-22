export interface ServerConfig {
  botClientId: string | null;
}

export interface UpdateServerConfigReq {
  botClientId?: string | null;
}
