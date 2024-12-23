import { Image } from './image.types';

export interface Message {
  id: string;
  body: string;
  images?: Image[];
  user: { name: string };
  createdAt: string;
}

export interface Channel {
  id: string;
  name: string;
}
