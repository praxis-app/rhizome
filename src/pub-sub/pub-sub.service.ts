import WebSocket from 'ws';
import * as authService from '../auth/auth.service';
import * as cacheService from '../cache/cache.service';
import { PubSubRequest, PubSubResponse, WebSocketWithId } from './pub-sub.models';

type ChannelHandler = (message: any, publisher: WebSocketWithId) => Promise<void>;

/** Local mapping of subscriber IDs to websockets */
const subscribers: Record<string, WebSocketWithId> = {};

/** Map of channel names to message handlers */
const channelHandlers: Record<string, ChannelHandler> = {};

// TODO: Determine if this is still needed
export const registerChannelHandler = (channel: string, handler: ChannelHandler) => {
  channelHandlers[channel] = handler;
};

export const handleMessage = async (webSocket: WebSocketWithId, data: WebSocket.RawData) => {
  const { channel, body, request, token }: PubSubRequest = JSON.parse(data.toString());

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
      publish(channel, body, webSocket);
      break;
    case 'SUBSCRIBE':
      subscribe(channel, token, webSocket);
      break;
    case 'UNSUBSCRIBE':
      unsubscribe(channel, token);
      break;
    default:
      webSocket.send(JSON.stringify({ error: 'Invalid request type' }));
  }
};

export const publish = async (channel: string, message: unknown, publisher?: WebSocketWithId) => {
  // Handle channel specific actions
  if (channelHandlers[channel] && publisher) {
    await channelHandlers[channel](message, publisher);
  }

  const channelKey = getChannelCacheKey(channel);
  const subscriberIds = await cacheService.getSetMembers(channelKey);
  if (subscriberIds.length === 0) {
    return;
  }

  for (const subscriberId of subscriberIds) {
    if (subscriberId === publisher?.id) {
      continue;
    }
    const subscriber = subscribers[subscriberId];
    if (subscriber?.readyState === WebSocket.OPEN) {
      subscriber.send(
        JSON.stringify({
          channel: channel,
          body: message,
        }),
      );
    }
  }
};

const subscribe = async (channel: string, token: string, subscriber: WebSocketWithId) => {
  subscriber.id = token;

  // Add subscriber to Redis set and local map
  const channelKey = getChannelCacheKey(channel);
  await cacheService.addSetMember(channelKey, token);
  subscribers[token] = subscriber;

  // Clean up on disconnect
  subscriber.on('close', async () => {
    await unsubscribe(channel, token);
    delete subscribers[token];
  });
};

const unsubscribe = async (channel: string, token: string) => {
  const channelKey = getChannelCacheKey(channel);
  await cacheService.removeSetMember(channelKey, token);
  delete subscribers[token];
};

const getChannelCacheKey = (channel: string) => {
  return `channel:${channel}`;
};
