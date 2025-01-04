import axios, { AxiosInstance, AxiosResponse, Method } from 'axios';
import { Channel, Message } from '../types/chat.types';
import { Image } from '../types/image.types';
import { CurrentUser } from '../types/user.types';
import { SignUpReq } from '../types/auth.types';

export const API_ROOT = '/api';

class ApiClient {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({ baseURL: API_ROOT });
  }

  signUp = async (data: SignUpReq) => {
    return this.executeRequest<{ token: string }>('post', '/auth', { data });
  };

  getCurrentUser = async () => {
    return this.executeRequest<{ user: CurrentUser }>('get', '/users/me');
  };

  createAnonSession = async () => {
    return this.executeRequest<{ token: string }>('post', '/auth/anon');
  };

  upgradeAnonSession = async (data: SignUpReq) => {
    return this.executeRequest<void>('put', '/auth/anon', { data });
  };

  logOut = async () => {
    return this.executeRequest<void>('post', '/auth/logout');
  };

  sendMessage = async (channelId: string, body: string, imageCount: number) => {
    const path = `/channels/${channelId}/messages`;
    return this.executeRequest<{ message: Message }>('post', path, {
      data: { channelId, body, imageCount },
    });
  };

  uploadMessageImage = async (
    channelId: string,
    messageId: string,
    imageId: string,
    formData: FormData,
  ) => {
    const path = `/channels/${channelId}/messages/${messageId}/images/${imageId}/upload`;
    return this.executeRequest<{ image: Image }>('post', path, {
      data: formData,
    });
  };

  getChannels = async () => {
    return this.executeRequest<{ channels: Channel[] }>('get', '/channels');
  };

  getChannelMessages = async (
    channelId: string,
    offset: number,
    limit = 20,
  ) => {
    const path = `/channels/${channelId}/messages`;
    return this.executeRequest<{ messages: Message[] }>('get', path, {
      params: { offset, limit },
    });
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
