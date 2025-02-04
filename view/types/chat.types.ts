import { Image } from './image.types';

export interface Message {
  id: string;
  body: string;
  images?: Image[];
  user: { id: string; name: string };
  createdAt: string;
}

export interface Channel {
  id: string;
  name: string;
}

export interface CreateChannelReq {
  name: string;
}

export interface MessagesQuery {
  pages: { messages: Message[] }[];
  pageParams: number[];
}
