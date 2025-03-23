import axios, { AxiosInstance, AxiosResponse, Method } from 'axios';
import { MESSAGES_PAGE_SIZE } from '../constants/message.constants';
import { LocalStorageKeys } from '../constants/shared.constants';
import { AuthRes, LoginReq, SignUpReq } from '../types/auth.types';
import {
  Channel,
  CreateChannelReq,
  UpdateChannelReq,
} from '../types/channel.types';
import { Image } from '../types/image.types';
import { CreateInviteReq, Invite } from '../types/invite.types';
import { Message } from '../types/message.types';
import {
  CreateRoleReq,
  Role,
  UpdateRolePermissionsReq,
} from '../types/role.types';
import {
  ConnectDiscordBotReq,
  ServerConfig,
  UpdateServerConfigReq,
} from '../types/server-config.types';
import { CurrentUser, User } from '../types/user.types';

class ApiClient {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({ baseURL: '/api' });
  }

  // -------------------------------------------------------------------------
  // Authentication
  // -------------------------------------------------------------------------

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

  createAnonSession = async (inviteToken?: string | null) => {
    const path = '/auth/anon';
    return this.executeRequest<AuthRes>('post', path, {
      data: { inviteToken },
    });
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

  // -------------------------------------------------------------------------
  // Users
  // -------------------------------------------------------------------------

  getCurrentUser = async () => {
    const path = '/users/me';
    return this.executeRequest<{ user: CurrentUser }>('get', path);
  };

  isFirstUser = async () => {
    const path = '/users/is-first';
    return this.executeRequest<{ isFirstUser: boolean }>('get', path);
  };

  // -------------------------------------------------------------------------
  // Channels & Messages
  // -------------------------------------------------------------------------

  getChannel = async (channelId: string) => {
    const path = `/channels/${channelId}`;
    return this.executeRequest<{ channel: Channel }>('get', path);
  };

  getChannels = async () => {
    const path = '/channels';
    return this.executeRequest<{ channels: Channel[] }>('get', path);
  };

  getGeneralChannel = async () => {
    const path = '/channels/general';
    return this.executeRequest<{ channel: Channel }>('get', path);
  };

  getChannelMessages = async (
    channelId: string,
    offset: number,
    limit = MESSAGES_PAGE_SIZE,
  ) => {
    const path = `/channels/${channelId}/messages`;
    return this.executeRequest<{ messages: Message[] }>('get', path, {
      params: { offset, limit },
    });
  };

  createChannel = async (data: CreateChannelReq) => {
    const path = '/channels';
    return this.executeRequest<{ channel: Channel }>('post', path, {
      data,
    });
  };

  updateChannel = async (channelId: string, data: UpdateChannelReq) => {
    const path = `/channels/${channelId}`;
    return this.executeRequest<void>('put', path, {
      data,
    });
  };

  deleteChannel = async (channelId: string) => {
    const path = `/channels/${channelId}`;
    return this.executeRequest<void>('delete', path);
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

  // -------------------------------------------------------------------------
  // Roles & Permissions
  // -------------------------------------------------------------------------

  getRole = async (roleId: string) => {
    const path = `/roles/${roleId}`;
    return this.executeRequest<{ role: Role }>('get', path);
  };

  getRoles = async () => {
    const path = '/roles';
    return this.executeRequest<{ roles: Role[] }>('get', path);
  };

  getUsersEligibleForRole = async (roleId: string) => {
    const path = `/roles/${roleId}/members/eligible`;
    return this.executeRequest<{ users: User[] }>('get', path);
  };

  createRole = async (data: CreateRoleReq) => {
    const path = '/roles';
    return this.executeRequest<{ role: Role }>('post', path, {
      data,
    });
  };

  updateRole = async (roleId: string, data: CreateRoleReq) => {
    const path = `/roles/${roleId}`;
    return this.executeRequest<void>('put', path, {
      data,
    });
  };

  updateRolePermissions = async (
    roleId: string,
    data: UpdateRolePermissionsReq,
  ) => {
    const path = `/roles/${roleId}/permissions`;
    return this.executeRequest<void>('put', path, {
      data,
    });
  };

  addRoleMembers = async (roleId: string, userIds: string[]) => {
    const path = `/roles/${roleId}/members`;
    return this.executeRequest<void>('post', path, {
      data: { userIds },
    });
  };

  removeRoleMember = async (roleId: string, userId: string) => {
    const path = `/roles/${roleId}/members/${userId}`;
    return this.executeRequest<void>('delete', path);
  };

  deleteRole = async (roleId: string) => {
    const path = `/roles/${roleId}`;
    return this.executeRequest<void>('delete', path);
  };

  // -------------------------------------------------------------------------
  // Invites
  // -------------------------------------------------------------------------

  getInvites = async () => {
    const path = '/invites';
    return this.executeRequest<{ invites: Invite[] }>('get', path);
  };

  getInvite = async (token: string) => {
    const path = `/invites/${token}`;
    return this.executeRequest<{ invite: Invite }>('get', path);
  };

  createInvite = async (data: CreateInviteReq) => {
    const path = '/invites';
    return this.executeRequest<{ invite: Invite }>('post', path, {
      data,
    });
  };

  deleteInvite = async (inviteId: string) => {
    const path = `/invites/${inviteId}`;
    return this.executeRequest<void>('delete', path);
  };

  // -------------------------------------------------------------------------
  // Server Configs
  // -------------------------------------------------------------------------

  getServerConfig = async () => {
    const path = '/server-configs';
    return this.executeRequest<{ serverConfig: ServerConfig }>('get', path);
  };

  updateServerConfig = async (data: UpdateServerConfigReq) => {
    const path = '/server-configs';
    return this.executeRequest<void>('put', path, {
      data,
    });
  };

  connectDiscordBot = async (data: ConnectDiscordBotReq) => {
    const path = '/server-configs/connect-bot';
    return this.executeRequest<void>('post', path, {
      data,
    });
  };

  disconnectDiscordBot = async () => {
    const path = '/server-configs/disconnect-bot';
    return this.executeRequest<void>('delete', path);
  };

  // -------------------------------------------------------------------------
  // Misc.
  // -------------------------------------------------------------------------

  getImage = (imageId: string) => {
    const path = `/images/${imageId}`;
    return this.executeRequest<Blob>('get', path, {
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
