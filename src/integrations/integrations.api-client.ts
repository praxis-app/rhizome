import axios, { AxiosInstance, AxiosResponse, Method } from 'axios';
import { getServerConfig } from '../server-configs/server-configs.service';
import {
  RegisterPraxisInstanceReq,
  RegisterPraxisInstanceRes,
} from './integrations.types';

class IntegrationsApiClient {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create();
  }

  registerPraxisInstance = async (data: RegisterPraxisInstanceReq) => {
    return this.executeRequest<RegisterPraxisInstanceRes>(
      'post',
      '/praxis-instances',
      { data },
    );
  };

  unregisterPraxisInstance = async () => {
    return this.executeRequest<void>('delete', '/praxis-instances');
  };

  getHealth = async () => {
    return this.executeRequest<{ timestamp: string }>('get', '/health');
  };

  private async executeRequest<T>(
    method: Method,
    path: string,
    options?: { data?: any; params?: any; responseType?: any },
  ): Promise<T> {
    try {
      const { appApiKey, botApiUrl } = await getServerConfig();

      if (!botApiUrl) {
        throw new Error('Bot API URL is not set');
      }

      const headers = {
        'x-api-key': appApiKey,
        'Content-Type': 'application/json',
      };

      const response: AxiosResponse<T> = await this.axiosInstance.request<T>({
        method,
        url: path,
        data: options?.data,
        params: options?.params,
        responseType: options?.responseType,
        baseURL: botApiUrl,
        headers,
      });

      return response.data;
    } catch (error) {
      console.error(`API request error: ${error}`);
      throw error;
    }
  }
}

export const integrationsApi = new IntegrationsApiClient();
