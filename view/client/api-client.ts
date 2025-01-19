import axios, { AxiosInstance, AxiosResponse, Method } from 'axios';
import { LocalStorageKeys } from '../constants/shared.constants';
import { AuthRes, LoginReq, SignUpReq } from '../types/auth.types';
import { Channel, Message } from '../types/chat.types';
import { Image } from '../types/image.types';
import { CreateRoleReq, Role } from '../types/role.types';
import { CurrentUser } from '../types/user.types';

class ApiClient {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({ baseURL: '/api' });
  }

  login = async (data: LoginReq) => {
    const path = '/auth/login';
    return this.executeRequest<AuthRes>('post', path, {
      data,
    });
  };

  signUp = async (data: SignUpReq) => {
    const path = '/auth/signup';
    return this.executeRequest<AuthRes>('post', path, {
      data,
    });
  };

  createAnonSession = async () => {
    const path = '/auth/anon';
    return this.executeRequest<AuthRes>('post', path);
  };

  upgradeAnonSession = async (data: SignUpReq) => {
    const path = '/auth/anon';
    return this.executeRequest<void>('put', path, {
      data,
    });
  };

  logOut = async () => {
    const path = '/auth/logout';
    return this.executeRequest<void>('delete', path);
  };

  getCurrentUser = async () => {
    const path = '/users/me';
    return this.executeRequest<{ user: CurrentUser }>('get', path);
  };

  getRole = async (id: string) => {
    const path = `/roles/${id}`;
    return this.executeRequest<{ role: Role }>('get', path);
  };

  getRoles = async () => {
    const path = '/roles';
    return this.executeRequest<{ roles: Role[] }>('get', path);
  };

  createRole = async (data: CreateRoleReq) => {
    const path = '/roles';
    return this.executeRequest<{ role: Role }>('post', path, {
      data,
    });
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
    const path = '/channels';
    return this.executeRequest<{ channels: Channel[] }>('get', path);
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
    return this.executeRequest<any>('get', path, {
      responseType: 'blob',
    });
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
      const token = localStorage.getItem(LocalStorageKeys.AccessToken);
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
