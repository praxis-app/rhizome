import axios from 'axios';
import crypto from 'crypto';
import * as dotenv from 'dotenv';
import { dataSource } from '../database/data-source';
import { integrationsApi } from '../integrations/integrations.api-client';
import { ServerConfig } from './models/server-config.entity';
import {
  ConnectBotReq,
  UpdateServerConfigReq,
} from './models/server-config.types';

dotenv.config();

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

  const apiKey = crypto.randomBytes(32).toString('hex');
  const apiUrl = `${process.env.SERVER_HOST}:${process.env.SERVER_PORT}`;
  const botApiUrl = data.botApiUrl.replace(/\/$/, '');

  const result = await integrationsApi.registerPraxisInstance({
    serverConfigId: serverConfig.id,
    apiUrl,
    apiKey,
  });

  return serverConfigRepository.update(serverConfig.id, {
    botApiKey: result.botApiKey,
    botClientId: data.botClientId,
    botApiUrl: botApiUrl,
    appApiKey: apiKey,
  });
};

export const disconnectBot = async () => {
  const serverConfig = await getServerConfig();

  // Remove the Praxis instance registration from the bot
  await axios.delete(`${serverConfig.botApiUrl}/praxis-instances`, {
    headers: { 'x-api-key': serverConfig.appApiKey },
  });

  // Remove the Praxis instance registration from the server config
  return serverConfigRepository.update(serverConfig.id, {
    botApiKey: null,
    botClientId: null,
    botApiUrl: null,
    appApiKey: null,
  });
};
