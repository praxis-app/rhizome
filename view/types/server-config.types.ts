export interface ServerConfig {
  botClientId: string | null;
  botApiUrl: string | null;
}

export interface UpdateServerConfigReq {
  botClientId?: string | null;
  botApiUrl?: string | null;
}

export interface ConnectBotReq {
  botClientId: string;
  botApiUrl: string;
}
