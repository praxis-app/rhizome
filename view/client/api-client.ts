import axios, { AxiosInstance, AxiosResponse, Method } from 'axios';
import { Channel, Message } from '../types/chat.types';
import { CurrentUser } from '../types/user.types';

export const API_ROOT = '/api';

class ApiClient {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({ baseURL: API_ROOT });
  }

  getCurrentUser = async () => {
    return this.executeRequest<{ user: CurrentUser }>('get', '/users/me');
  };

  register = async (clientId: string) => {
    return this.executeRequest<{ token: string }>('post', '/auth', {
      data: { clientId },
    });
  };

  sendMessage = async (channelId: number, body: string) => {
    const path = `/channels/${channelId}/messages`;
    return this.executeRequest<{ message: Message }>('post', path, {
      data: { channelId, body },
    });
  };

  getChannels = async () => {
    return this.executeRequest<{ channels: Channel[] }>('get', '/channels');
  };

  getChannelMessages = async (channelId: number) => {
    const path = `/channels/${channelId}/messages`;
    return this.executeRequest<{ messages: Message[] }>('get', path);
  };

  getHealth = async () => {
    return this.executeRequest<{ timestamp: string }>('get', '/health');
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
