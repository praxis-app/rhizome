import { dataSource } from '../database/data-source';
import { ServerConfig } from './server-config.entity';

interface UpdateServerConfigReq {
  botClientId?: string | null;
  botApiUrl?: string | null;
}

interface ConnectBotReq {
  botClientId: string;
  botApiUrl: string;
}

const serverConfigRepository = dataSource.getRepository(ServerConfig);

export const getServerConfig = async () => {
  const serverConfigs = await serverConfigRepository.find();
  if (!serverConfigs.length) {
    return initializeServerConfig();
  }
  return serverConfigs[0];
};

export const initializeServerConfig = async () => {
  return serverConfigRepository.save({});
};

export const updateServerConfig = async (data: UpdateServerConfigReq) => {
  const serverConfig = await getServerConfig();
  return serverConfigRepository.update(serverConfig.id, data);
};

export const connectBot = async (data: ConnectBotReq) => {
  const serverConfig = await getServerConfig();
  const result = await serverConfigRepository.update(serverConfig.id, data);

  // TODO: Send a request to the bot to connect with API keys sent in both directions

  return result;
};
