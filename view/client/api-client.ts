import axios, { AxiosInstance, AxiosResponse, Method } from 'axios';
import { Channel, Message } from '../types/chat.types';
import { CurrentUser } from '../types/user.types';
import { Image } from '../types/image.types';

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

  sendMessage = async (channelId: string, body: string) => {
    const path = `/channels/${channelId}/messages`;
    return this.executeRequest<{ message: Message }>('post', path, {
      data: { channelId, body },
    });
  };

  uploadMessageImages = async (
    channelId: string,
    messageId: string,
    formData: FormData,
  ) => {
    const path = `/channels/${channelId}/messages/${messageId}/images`;
    return this.executeRequest<{ images: Image[] }>('post', path, {
      data: formData,
    });
  };

  getChannels = async () => {
    return this.executeRequest<{ channels: Channel[] }>('get', '/channels');
  };

  getChannelMessages = async (channelId: string) => {
    const path = `/channels/${channelId}/messages`;
    return this.executeRequest<{ messages: Message[] }>('get', path);
  };

  getImage = (imageId: string) => {
    const path = `/images/${imageId}`;
    return this.executeRequest<any>('get', path, { responseType: 'blob' });
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
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response: AxiosResponse<T> = await this.axiosInstance.request<T>({
        method,
        url: path,
        data: options?.data,
        params: options?.params,
        responseType: options?.responseType,
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
