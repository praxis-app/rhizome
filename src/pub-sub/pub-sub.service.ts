import WebSocket from 'ws';
import { authService } from '../auth/auth.service';
import { cacheService } from '../cache/cache.service';
import {
  PubSubRequest,
  PubSubResponse,
  WebSocketWithId,
} from './pub-sub.models';

type ChannelHandler = (
  message: any,
  publisher: WebSocketWithId,
) => Promise<void>;

class PubSubService {
  /** Local mapping of subscriber IDs to websockets */
  private subscribers: Record<string, WebSocketWithId>;

  /** Map of channel names to message handlers */
  private channelHandlers: Record<string, ChannelHandler>;

  constructor() {
    this.subscribers = {};
    this.channelHandlers = {};
  }

  registerChannelHandler(channel: string, handler: ChannelHandler) {
    this.channelHandlers[channel] = handler;
  }

  async handleMessage(webSocket: WebSocketWithId, data: WebSocket.RawData) {
    const { channel, body, request, token }: PubSubRequest = JSON.parse(
      data.toString(),
    );

    const user = await authService.verifyToken(token);
    if (!user) {
      const response: PubSubResponse = {
        error: { code: 'UNAUTHORIZED', message: 'Invalid token' },
        type: 'RESPONSE',
        channel,
      };
      webSocket.send(JSON.stringify(response));
      return;
    }

    switch (request) {
      case 'PUBLISH':
        this.publish(channel, body, webSocket);
        break;
      case 'SUBSCRIBE':
        this.subscribe(channel, token, webSocket);
        break;
      case 'UNSUBSCRIBE':
        this.unsubscribe(channel, token);
        break;
      default:
        webSocket.send(JSON.stringify({ error: 'Invalid request type' }));
    }
  }

  async publish(
    channel: string,
    message: unknown,
    publisher?: WebSocketWithId,
  ) {
    // Handle channel specific actions
    if (this.channelHandlers[channel] && publisher) {
      await this.channelHandlers[channel](message, publisher);
    }

    const channelKey = this.getChannelCacheKey(channel);
    const subscriberIds = await cacheService.getSetMembers(channelKey);
    if (subscriberIds.length === 0) {
      return;
    }

    for (const subscriberId of subscriberIds) {
      if (subscriberId === publisher?.id) {
        continue;
      }
      const subscriber = this.subscribers[subscriberId];
      if (subscriber?.readyState === WebSocket.OPEN) {
        subscriber.send(
          JSON.stringify({
            channel: channel,
            body: message,
          }),
        );
      }
    }
  }

  async subscribe(channel: string, token: string, subscriber: WebSocketWithId) {
    subscriber.id = token;

    // Add subscriber to Redis set and local map
    const channelKey = this.getChannelCacheKey(channel);
    await cacheService.addSetMember(channelKey, token);
    this.subscribers[token] = subscriber;

    // Clean up on disconnect
    subscriber.on('close', async () => {
      await this.unsubscribe(channel, token);
      delete this.subscribers[token];
    });
  }

  async unsubscribe(channel: string, token: string) {
    const channelKey = this.getChannelCacheKey(channel);
    await cacheService.removeSetMember(channelKey, token);
    delete this.subscribers[token];
  }

  getChannelCacheKey(channel: string) {
    return `channel:${channel}`;
  }
}

export const pubSubService = new PubSubService();
