export interface Message {
  id: number;
  body: string;

  // TODO: Add images, currently not implemented
  images: any[];

  user: { name: string };
  createdAt: string;
}

export interface Channel {
  id: number;
  name: string;
}
