import axios from 'axios';
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

// TODO: Decide whether to move to integrations service
export const connectBot = async (data: ConnectBotReq) => {
  const serverConfig = await getServerConfig();

  const result = await axios.post<{ botApiKey: string }>(
    data.botApiUrl,
    {
      serverConfigId: serverConfig.id,
      botClientId: data.botClientId,
      botApiUrl: data.botApiUrl,
    },
    { headers: { 'Content-Type': 'application/json' } },
  );

  return serverConfigRepository.update(serverConfig.id, {
    botApiKey: result.data.botApiKey,
    ...data,
  });
};

// TODO: Decide whether to move to integrations service
export const disconnectBot = async () => {
  const serverConfig = await getServerConfig();

  // TODO: Call the bot API to disconnect

  return serverConfigRepository.update(serverConfig.id, {
    botApiKey: null,
    botClientId: null,
    botApiUrl: null,
  });
};
