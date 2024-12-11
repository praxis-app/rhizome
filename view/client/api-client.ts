import axios, { AxiosInstance, AxiosResponse, Method } from 'axios';
import { API_ROOT } from './api-client.constants';

class ApiClient {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({ baseURL: API_ROOT });
  }

  register = async (clientId: string) => {
    return this.executeRequest<{ token: string }>('post', '/auth', {
      data: { clientId },
    });
  };

  getChannels = async () => {
    return this.executeRequest<{ channels: { id: number; name: string }[] }>(
      'get',
      '/channels',
    );
  };

  getChannelMessages = async (channelId: number) => {
    const path = `/channels/${channelId}/messages`;
    return this.executeRequest<{ messages: { id: number; body: string }[] }>(
      'get',
      path,
    );
  };

  getHealth = async () => {
    return this.executeRequest<{ timestamp: string }>('get', '/health');
  };

  sendMessage = async (channelId: number, body: string) => {
    const path = `/channels/${channelId}/messages`;
    return this.executeRequest<{ message: any }>('post', path, {
      data: { channelId, body },
    });
  };

  private async executeRequest<T>(
    method: Method,
    path: string,
    options?: { data?: any; params?: any },
  ): Promise<T> {
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response: AxiosResponse<T> = await this.axiosInstance.request<T>({
        method,
        url: path,
        data: options?.data,
        params: options?.params,
        headers,
      });

      return response.data;
    } catch (error) {
      console.error(`API request error: ${error}`);
      throw error;
    }
  }
}

export const api = new ApiClient();
