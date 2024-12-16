export interface Message {
  id: string;
  body: string;

  // TODO: Add images, currently not implemented
  images: any[];

  user: { name: string };
  createdAt: string;
}

export interface Channel {
  id: string;
  name: string;
}
